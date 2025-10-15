"""
AI Chat API views for KindBite application.
"""
from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.db import transaction
from django.db import models

from .models import ChatSession, ChatMessage, ChatFeedback
from .serializers import (
    ChatSessionSerializer, ChatSessionListSerializer, ChatMessageSerializer,
    SendMessageSerializer, ChatResponseSerializer, ChatFeedbackSerializer
)
from .services import AIResponseService, ChatSessionService


class ChatSessionListView(ListAPIView):
    """
    List user's chat sessions.
    """
    serializer_class = ChatSessionListSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ChatSessionService.get_user_sessions(self.request.user)


class ChatSessionDetailView(APIView):
    """
    Get detailed chat session with all messages.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        try:
            session = ChatSession.objects.get(
                id=pk, 
                user=request.user, 
                is_active=True
            )
            serializer = ChatSessionSerializer(session)
            return Response(serializer.data)
        except ChatSession.DoesNotExist:
            return Response(
                {'error': 'Chat session not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )

    def delete(self, request, pk):
        """Delete (deactivate) a chat session."""
        try:
            session = ChatSession.objects.get(
                id=pk, 
                user=request.user, 
                is_active=True
            )
            session.is_active = False
            session.save()
            return Response({'message': 'Chat session deleted successfully'})
        except ChatSession.DoesNotExist:
            return Response(
                {'error': 'Chat session not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )


@method_decorator(csrf_exempt, name='dispatch')
class SendMessageView(APIView):
    """
    Send a message to AI chat and get response.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = SendMessageSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                serializer.errors, 
                status=status.HTTP_400_BAD_REQUEST
            )

        user_message = serializer.validated_data['message']
        session_id = serializer.validated_data.get('session_id')

        try:
            with transaction.atomic():
                # Get or create session
                session = ChatSessionService.get_or_create_session(
                    request.user, session_id
                )

                # Create user message
                user_msg = ChatSessionService.create_message(
                    session=session,
                    message_type=ChatMessage.MessageType.USER,
                    content=user_message
                )

                # Generate AI response
                print(f"🤖 Generating AI response for: '{user_message}'")
                ai_service = AIResponseService()
                ai_response, response_time = ai_service.generate_response(
                    user_message, session
                )
                print(f"🤖 AI response generated in {response_time}ms: {ai_response[:100]}...")

                # Create AI message
                ai_msg = ChatSessionService.create_message(
                    session=session,
                    message_type=ChatMessage.MessageType.AI,
                    content=ai_response,
                    response_time_ms=response_time
                )

                # Update session title if needed
                ChatSessionService.update_session_title(session, user_message)

                # Prepare response
                response_data = {
                    'session_id': session.id,
                    'user_message': ChatMessageSerializer(user_msg).data,
                    'ai_response': ChatMessageSerializer(ai_msg).data,
                    'session_title': session.title
                }

                return Response(response_data, status=status.HTTP_201_CREATED)

        except Exception as e:
            print(f"Error in SendMessageView: {e}")
            import traceback
            traceback.print_exc()
            return Response(
                {'error': f'Failed to process message: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


@method_decorator(csrf_exempt, name='dispatch')
class ChatFeedbackView(APIView):
    """
    Submit feedback for AI responses.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            message = ChatMessage.objects.get(
                id=pk,
                message_type=ChatMessage.MessageType.AI,
                session__user=request.user
            )
        except ChatMessage.DoesNotExist:
            return Response(
                {'error': 'Message not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = ChatFeedbackSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                serializer.errors, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Create or update feedback
        feedback, created = ChatFeedback.objects.update_or_create(
            message=message,
            user=request.user,
            defaults={
                'rating': serializer.validated_data['rating'],
                'comment': serializer.validated_data.get('comment', '')
            }
        )

        return Response(
            ChatFeedbackSerializer(feedback).data,
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK
        )


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def chat_stats(request):
    """
    Get user's chat statistics.
    """
    user = request.user
    
    stats = {
        'total_sessions': ChatSession.objects.filter(user=user, is_active=True).count(),
        'total_messages': ChatMessage.objects.filter(
            session__user=user,
            message_type=ChatMessage.MessageType.USER
        ).count(),
        'avg_response_time': ChatMessage.objects.filter(
            session__user=user,
            message_type=ChatMessage.MessageType.AI,
            response_time_ms__isnull=False
        ).aggregate(
            avg_time=models.Avg('response_time_ms')
        )['avg_time'] or 0,
        'feedback_given': ChatFeedback.objects.filter(user=user).count()
    }
    
    return Response(stats)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def create_new_chat(request):
    """
    Create a new chat session.
    """
    session = ChatSession.objects.create(user=request.user)
    return Response({
        'session_id': session.id,
        'title': session.title,
        'created_at': session.created_at
    }, status=status.HTTP_201_CREATED)