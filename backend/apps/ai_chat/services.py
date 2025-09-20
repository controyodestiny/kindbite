"""
AI Chat services for generating intelligent responses.
This module handles the AI logic for responding to user queries about food and KindBite.
"""
import time
import re
from openai import OpenAI
from typing import Dict, List, Tuple
from django.conf import settings
from django.db.models import Q
from .models import AIKnowledgeBase, ChatSession, ChatMessage


class AIResponseService:
    """
    Service class for generating AI responses to user queries.
    Uses OpenAI GPT for intelligent responses about food and KindBite topics.
    """
    
    def __init__(self):
        # Initialize OpenAI client
        self.openai_client = OpenAI(api_key=settings.OPENAI_API_KEY) if settings.OPENAI_API_KEY else None
        
        self.system_prompt = """You are KindBite AI Assistant, a helpful and knowledgeable assistant for the KindBite food waste reduction platform. 

ABOUT KINDBITE:
KindBite is a revolutionary food waste reduction platform that connects food providers (restaurants, home kitchens, supermarkets, factories) with food seekers to prevent good food from going to waste. Our mission is to create a sustainable food ecosystem where excess food finds its way to people who need it.

KEY FEATURES:
- Food providers list surplus food with details and pickup times
- Food seekers browse and reserve available items in their area
- Users earn KindCoins for their environmental impact
- Every transaction helps reduce food waste and supports the community

USER ROLES:
- End Users (Food Seekers) - Find and reserve surplus food
- Restaurants - List excess meals and ingredients
- Home Kitchens - Share home-cooked surplus food
- Food Factories - Distribute surplus production
- Supermarkets - Offer near-expiry items
- Retail Shops - Share unsold food products
- Food Verifiers - Ensure food safety standards
- Food Ambassadors - Promote community engagement
- Donors/Buyers - Support the ecosystem financially

KINDCOINS SYSTEM:
KindCoins track positive environmental impact. Users earn them for saving food from waste. Each KindCoin represents measurable benefits: CO2 reduction (~2.5kg per meal), water conservation, packaging waste reduction, and landfill diversion.

YOUR ROLE:
- Answer questions about KindBite platform, features, and how it works
- Provide food safety guidance and storage tips
- Share nutrition information and cooking suggestions
- Offer sustainability tips and environmental impact information
- Help users understand how to use the platform effectively
- Be friendly, helpful, and encouraging about food waste reduction

Always prioritize food safety. When in doubt about food safety, recommend consulting Food Verifiers or being cautious. Keep responses concise but informative, and use emojis to make responses friendly and engaging."""

        self.kindbite_info = {
            "what_is_kindbite": """KindBite is a revolutionary food waste reduction platform that connects food providers 
            (restaurants, home kitchens, supermarkets, factories) with food seekers to prevent good food from going to waste. 
            Our mission is to create a sustainable food ecosystem where excess food finds its way to people who need it.""",
            
            "how_it_works": """KindBite works through a simple 4-step process:
            1. Food providers list their surplus food items with details and pickup times
            2. Food seekers browse available items in their area through our app
            3. Users reserve items they want and earn KindCoins for their environmental impact
            4. Pickup is arranged directly between provider and seeker
            
            Every transaction helps reduce food waste and supports our community!""",
            
            "user_roles": """KindBite supports various user types:
            • End Users (Food Seekers) - Find and reserve surplus food
            • Restaurants - List excess meals and ingredients
            • Home Kitchens - Share home-cooked surplus food
            • Food Factories - Distribute surplus production
            • Supermarkets - Offer near-expiry items
            • Retail Shops - Share unsold food products
            • Food Verifiers - Ensure food safety standards
            • Food Ambassadors - Promote community engagement
            • Donors/Buyers - Support the ecosystem financially""",
            
            "kindcoins": """KindCoins are our reward system that tracks your positive environmental impact:
            • Earn KindCoins for every food item you save from waste
            • Each KindCoin represents measurable environmental benefits
            • Track your impact: CO2 saved, water conserved, packaging reduced
            • Use KindCoins for future transactions and community rewards
            • Build your reputation as an eco-conscious community member""",
            
            "environmental_impact": """Every action on KindBite creates measurable environmental benefits:
            • CO2 Reduction: Each saved meal prevents ~2.5kg of CO2 emissions
            • Water Conservation: Food production uses massive amounts of water
            • Packaging Waste: Reducing food waste also reduces packaging waste
            • Food Miles: Local food sharing reduces transportation emissions
            • Landfill Diversion: Prevents organic waste from producing methane"""
        }
        
        self.food_safety_tips = {
            "general": """Food safety is our top priority! Here are key guidelines:
            • Check expiration dates and food appearance before consuming
            • Ensure proper storage temperature was maintained
            • Trust your senses - if something looks, smells, or tastes off, don't eat it
            • When in doubt, don't risk it - food safety comes first
            • Report any food safety concerns to our Food Verifiers""",
            
            "storage": """Proper food storage tips:
            • Refrigerated items: Keep at 40°F (4°C) or below
            • Frozen items: Maintain at 0°F (-18°C) or below  
            • Dry goods: Store in cool, dry places away from direct sunlight
            • Fresh produce: Different items have different storage needs
            • Leftovers: Consume within 3-4 days when properly refrigerated""",
            
            "pickup": """Safe food pickup guidelines:
            • Verify pickup time and location with the provider
            • Bring insulated bags for temperature-sensitive items
            • Check food condition upon pickup
            • Ask about storage conditions and preparation time
            • Transport food safely and consume promptly"""
        }

    def generate_response(self, user_message: str, session: ChatSession) -> Tuple[str, int]:
        """
        Generate an AI response to the user's message using OpenAI GPT.
        Returns tuple of (response_text, response_time_ms)
        """
        start_time = time.time()
        
        try:
            # Get conversation context
            context_messages = self._get_conversation_context(session)
            
            # Prepare messages for OpenAI API
            messages = [{"role": "system", "content": self.system_prompt}]
            
            # Add recent conversation history
            for msg in context_messages[-6:]:  # Last 3 exchanges
                role = "user" if msg.message_type == "user" else "assistant"
                messages.append({"role": role, "content": msg.content})
            
            # Add current user message
            messages.append({"role": "user", "content": user_message})
            
            # Generate response using OpenAI
            if self.openai_client:
                response = self._generate_openai_response(messages)
            else:
                # Fallback to rule-based responses if no API key
                response = self._generate_fallback_response(user_message.lower().strip())
            
        except Exception as e:
            print(f"Error generating AI response: {e}")
            response = self._get_error_response()
        
        # Calculate response time
        response_time = int((time.time() - start_time) * 1000)
        
        return response, response_time

    def _generate_openai_response(self, messages: List[Dict]) -> str:
        """Generate response using OpenAI API."""
        try:
            response = self.openai_client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=messages,
                max_tokens=500,
                temperature=0.7,
                presence_penalty=0.1,
                frequency_penalty=0.1
            )
            
            return response.choices[0].message.content.strip()
            
        except Exception as e:
            print(f"OpenAI API error: {e}")
            return self._get_error_response()

    def _generate_fallback_response(self, message: str) -> str:
        """Generate fallback response when OpenAI is not available."""
        # Check for greetings
        if self._is_greeting(message):
            return self._get_greeting_response()
        
        # Check for KindBite-specific queries
        kindbite_response = self._check_kindbite_queries(message)
        if kindbite_response:
            return kindbite_response
        
        # Check for food safety queries
        safety_response = self._check_food_safety_queries(message)
        if safety_response:
            return safety_response
        
        # Check for food/nutrition queries
        food_response = self._check_food_queries(message)
        if food_response:
            return food_response
        
        # Default response
        return self._get_default_response(message)

    def _get_error_response(self) -> str:
        """Get a friendly error response."""
        return """🤖 I apologize, but I'm having trouble processing your request right now. 

Please try asking your question again, or you can:
• Ask about KindBite features and how the platform works
• Get food safety tips and storage guidelines  
• Learn about sustainability and reducing food waste
• Find out about KindCoins and environmental impact

I'm here to help with anything related to food and KindBite! 🌱"""

    def _get_conversation_context(self, session: ChatSession) -> List:
        """Get recent conversation context for better responses."""
        recent_messages = session.messages.filter(
            message_type__in=['user', 'ai']
        ).order_by('-created_at')[:6]  # Last 3 exchanges
        
        return list(reversed(recent_messages))

    def _generate_contextual_response(self, message: str, context: List[str]) -> str:
        """Generate response based on message content and context."""
        
        # Check for greetings
        if self._is_greeting(message):
            return self._get_greeting_response()
        
        # Check for KindBite-specific queries
        kindbite_response = self._check_kindbite_queries(message)
        if kindbite_response:
            return kindbite_response
        
        # Check for food safety queries
        safety_response = self._check_food_safety_queries(message)
        if safety_response:
            return safety_response
        
        # Check for food/nutrition queries
        food_response = self._check_food_queries(message)
        if food_response:
            return food_response
        
        # Check knowledge base
        kb_response = self._search_knowledge_base(message)
        if kb_response:
            return kb_response
        
        # Default helpful response
        return self._get_default_response(message)

    def _is_greeting(self, message: str) -> bool:
        """Check if message is a greeting."""
        greetings = ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening']
        return any(greeting in message for greeting in greetings)

    def _get_greeting_response(self) -> str:
        """Get a friendly greeting response."""
        return """Hello! 👋 I'm your KindBite AI assistant, here to help you with:

🍽️ **Food & Nutrition Questions** - Ask about ingredients, recipes, or nutritional info
🌱 **Sustainability Tips** - Learn how to reduce food waste and environmental impact  
🛡️ **Food Safety** - Get guidance on safe food handling and storage
📱 **KindBite Platform** - Learn how to use our app and features
🏆 **KindCoins & Impact** - Understand our reward system and environmental benefits

What would you like to know about? Just ask me anything related to food or KindBite!"""

    def _check_kindbite_queries(self, message: str) -> str:
        """Check for KindBite-specific queries."""
        
        if any(word in message for word in ['what is kindbite', 'about kindbite', 'kindbite is']):
            return f"🌱 **About KindBite**\n\n{self.kindbite_info['what_is_kindbite']}"
        
        if any(word in message for word in ['how does kindbite work', 'how it works', 'how kindbite works']):
            return f"🔄 **How KindBite Works**\n\n{self.kindbite_info['how_it_works']}"
        
        if any(word in message for word in ['user roles', 'user types', 'who can use', 'roles']):
            return f"👥 **User Roles in KindBite**\n\n{self.kindbite_info['user_roles']}"
        
        if any(word in message for word in ['kindcoins', 'kind coins', 'rewards', 'points']):
            return f"🪙 **About KindCoins**\n\n{self.kindbite_info['kindcoins']}"
        
        if any(word in message for word in ['environmental impact', 'environment', 'sustainability', 'eco']):
            return f"🌍 **Environmental Impact**\n\n{self.kindbite_info['environmental_impact']}"
        
        return None

    def _check_food_safety_queries(self, message: str) -> str:
        """Check for food safety related queries."""
        
        if any(word in message for word in ['food safety', 'safe to eat', 'food poisoning', 'expired']):
            return f"🛡️ **Food Safety Guidelines**\n\n{self.food_safety_tips['general']}"
        
        if any(word in message for word in ['storage', 'store food', 'keep fresh', 'refrigerate']):
            return f"❄️ **Food Storage Tips**\n\n{self.food_safety_tips['storage']}"
        
        if any(word in message for word in ['pickup', 'collect food', 'transportation', 'transport']):
            return f"🚗 **Safe Food Pickup**\n\n{self.food_safety_tips['pickup']}"
        
        return None

    def _check_food_queries(self, message: str) -> str:
        """Check for general food and nutrition queries."""
        
        if any(word in message for word in ['recipe', 'cook', 'cooking', 'prepare']):
            return """👨‍🍳 **Cooking & Recipes**

I'd love to help with cooking tips! Here are some ideas:
• **Quick meals** with surplus ingredients
• **Food preservation** techniques to extend freshness  
• **Creative recipes** to use up leftover ingredients
• **Batch cooking** tips to minimize waste

What specific ingredients or type of recipe are you looking for? I can suggest ways to make delicious meals while reducing food waste!"""

        if any(word in message for word in ['nutrition', 'healthy', 'vitamins', 'nutrients']):
            return """🥗 **Nutrition & Health**

Eating rescued food can be both healthy and sustainable! Here's what to consider:
• **Check nutritional labels** on packaged items
• **Fresh produce** near expiry often retains most nutrients
• **Variety is key** - different foods provide different nutrients
• **Proper storage** helps maintain nutritional value

Would you like specific nutritional information about certain foods, or tips on maintaining a healthy diet while using KindBite?"""

        if any(word in message for word in ['waste', 'reduce waste', 'food waste', 'leftovers']):
            return """♻️ **Reducing Food Waste**

Great question! Here are effective strategies:
• **Plan meals** around what you have
• **Use the FIFO method** (First In, First Out) for your pantry
• **Get creative with leftovers** - transform them into new dishes
• **Proper storage** extends food life significantly
• **Share surplus** through KindBite when you can't use it all

Every small action counts toward reducing the 1.3 billion tons of food wasted globally each year!"""

        return None

    def _search_knowledge_base(self, message: str) -> str:
        """Search the knowledge base for relevant information."""
        try:
            # Extract keywords from the message
            keywords = re.findall(r'\b\w+\b', message)
            keywords = [word for word in keywords if len(word) > 3]  # Filter short words
            
            if not keywords:
                return None
            
            # Search knowledge base
            query = Q()
            for keyword in keywords[:5]:  # Limit to 5 keywords
                query |= Q(keywords__icontains=keyword) | Q(content__icontains=keyword) | Q(title__icontains=keyword)
            
            entries = AIKnowledgeBase.objects.filter(
                query, is_active=True
            ).order_by('-priority', 'title')[:3]  # Top 3 matches
            
            if entries:
                response = "📚 **From our Knowledge Base:**\n\n"
                for entry in entries:
                    response += f"**{entry.title}**\n{entry.content}\n\n"
                return response.strip()
                
        except Exception as e:
            # Log error in production
            pass
        
        return None

    def _get_default_response(self, message: str) -> str:
        """Get a helpful default response when no specific match is found."""
        return """🤖 **I'm here to help!**

I specialize in questions about:
• **KindBite platform** - how it works, features, and benefits
• **Food safety** - storage, handling, and safety guidelines
• **Nutrition** - healthy eating and food information
• **Sustainability** - reducing food waste and environmental impact
• **Recipes & Cooking** - making the most of available ingredients

Could you rephrase your question or ask about any of these topics? I'm always learning and want to give you the most helpful response possible! 

For urgent food safety concerns, please contact our Food Verifiers directly through the app."""


class ChatSessionService:
    """Service for managing chat sessions."""
    
    @staticmethod
    def get_or_create_session(user, session_id=None):
        """Get existing session or create a new one."""
        if session_id:
            try:
                session = ChatSession.objects.get(id=session_id, user=user, is_active=True)
                return session
            except ChatSession.DoesNotExist:
                pass
        
        # Create new session
        session = ChatSession.objects.create(user=user)
        return session
    
    @staticmethod
    def create_message(session, message_type, content, response_time_ms=None):
        """Create a new message in the session."""
        return ChatMessage.objects.create(
            session=session,
            message_type=message_type,
            content=content,
            response_time_ms=response_time_ms
        )
    
    @staticmethod
    def update_session_title(session, user_message):
        """Update session title based on first user message."""
        if session.messages.count() <= 2:  # First exchange
            # Generate title from user message (first 50 chars)
            title = user_message[:47] + "..." if len(user_message) > 50 else user_message
            session.title = title
            session.save(update_fields=['title'])
    
    @staticmethod
    def get_user_sessions(user, limit=20):
        """Get user's chat sessions."""
        return ChatSession.objects.filter(
            user=user, is_active=True
        ).prefetch_related('messages')[:limit]
