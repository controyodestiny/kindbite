/**
 * Chat service for KindBite AI chat functionality.
 * Handles communication with the AI chat backend API using fetch.
 */
import { API_CONFIG, STORAGE_KEYS, getAuthHeaders, buildUrl } from '../config/api';

class ChatService {
  constructor() {
    this.baseUrl = `${API_CONFIG.BASE_URL}/chat`;
    this.timeout = API_CONFIG.TIMEOUT;
  }

  /**
   * Make an authenticated API request using fetch
   */
  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = getAuthHeaders();

    const config = {
      method: 'GET',
      headers,
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    };

    // Add timeout handling
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      config.signal = controller.signal;
      const response = await fetch(url, config);
      clearTimeout(timeoutId);

      if (response.status === 401) {
        // Try to refresh token
        const refreshed = await this.refreshToken();
        if (refreshed) {
          // Retry with new token
          const newHeaders = getAuthHeaders();
          config.headers = {
            ...newHeaders,
            ...options.headers,
          };
          const retryResponse = await fetch(url, config);
          if (!retryResponse.ok) {
            throw new Error(`HTTP ${retryResponse.status}: ${retryResponse.statusText}`);
          }
          return await retryResponse.json();
        } else {
          throw new Error('Authentication failed. Please log in again.');
        }
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error('Request timed out. Please try again.');
      }
      throw error;
    }
  }

  /**
   * Refresh authentication token
   */
  async refreshToken() {
    const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    if (!refreshToken) {
      this.clearAuth();
      return false;
    }

    try {
      const response = await fetch(buildUrl('/auth/token/refresh/'), {
        method: 'POST',
        headers: API_CONFIG.HEADERS,
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, data.access);
        return true;
      } else {
        this.clearAuth();
        return false;
      }
    } catch (error) {
      this.clearAuth();
      return false;
    }
  }

  /**
   * Clear authentication data
   */
  clearAuth() {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  }

  /**
   * Send a message to the AI chat
   */
  async sendMessage(message, sessionId = null) {
    return await this.makeRequest('/send/', {
      method: 'POST',
      body: JSON.stringify({
        message: message.trim(),
        session_id: sessionId,
      }),
    });
  }

  /**
   * Get list of user's chat sessions
   */
  async getChatSessions() {
    return await this.makeRequest('/sessions/');
  }

  /**
   * Get detailed chat session with messages
   */
  async getChatSession(sessionId) {
    return await this.makeRequest(`/sessions/${sessionId}/`);
  }

  /**
   * Create a new chat session
   */
  async createNewChat() {
    return await this.makeRequest('/sessions/new/', {
      method: 'POST',
    });
  }

  /**
   * Delete a chat session
   */
  async deleteChatSession(sessionId) {
    return await this.makeRequest(`/sessions/${sessionId}/`, {
      method: 'DELETE',
    });
  }

  /**
   * Submit feedback for an AI message
   */
  async submitFeedback(messageId, rating, comment = '') {
    return await this.makeRequest(`/messages/${messageId}/feedback/`, {
      method: 'POST',
      body: JSON.stringify({
        rating,
        comment,
      }),
    });
  }

  /**
   * Get chat statistics
   */
  async getChatStats() {
    return await this.makeRequest('/stats/');
  }

}

// Create and export a singleton instance
const chatService = new ChatService();
export default chatService;
