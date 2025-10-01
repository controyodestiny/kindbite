import React, { useState, useEffect } from 'react';
import { Search, X, Send, ArrowLeft, MoreHorizontal, Image as ImageIcon, Smile } from 'lucide-react';

const MessagesView = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState('');
  const [showAddContact, setShowAddContact] = useState(false);
  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = () => {
    const saved = localStorage.getItem('kindbite_conversations');
    if (saved) {
      try {
        setConversations(JSON.parse(saved));
      } catch (e) {
        loadDefaultConversations();
      }
    } else {
      loadDefaultConversations();
    }
  };

  const loadDefaultConversations = () => {
    const defaultConvs = [
      {
        id: 1,
        name: "Sarah's Kitchen",
        phone: "+256 772 123 456",
        avatar: "👩‍🍳",
        lastMessage: "The bread is ready for pickup! 🍞",
        time: "2h ago",
        unread: true,
        messages: [
          { id: 1, sender: 'other', text: "Hey! I have fresh bread available 🍞", time: "2:30 PM" },
          { id: 2, sender: 'user', text: "That sounds great! What kind?", time: "2:32 PM" },
          { id: 3, sender: 'other', text: "Whole wheat and sourdough!", time: "2:33 PM" },
          { id: 4, sender: 'other', text: "The bread is ready for pickup! 🍞", time: "4:15 PM" }
        ]
      },
      {
        id: 2,
        name: "Green Market",
        phone: "+256 701 987 654",
        avatar: "🛒",
        lastMessage: "Fresh produce available today",
        time: "5h ago",
        unread: false,
        messages: [
          { id: 1, sender: 'other', text: "We have surplus vegetables today 🥬", time: "1:20 PM" },
          { id: 2, sender: 'user', text: "What do you have?", time: "1:22 PM" },
          { id: 3, sender: 'other', text: "Fresh produce available today", time: "1:25 PM" }
        ]
      },
      {
        id: 3,
        name: "Mama Rose Restaurant",
        phone: "+256 712 345 678",
        avatar: "🍽️",
        lastMessage: "Lunch specials ready",
        time: "Yesterday",
        unread: false,
        messages: [
          { id: 1, sender: 'other', text: "Lunch specials ready 🍛", time: "12:30 PM" }
        ]
      }
    ];
    setConversations(defaultConvs);
    localStorage.setItem('kindbite_conversations', JSON.stringify(defaultConvs));
  };

  const handleSendMessage = () => {
    if (!message.trim() || !selectedConversation) return;

    const newMsg = {
      id: Date.now(),
      sender: 'user',
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...selectedConversation.messages, newMsg];
    
    const updated = conversations.map(conv => {
      if (conv.id === selectedConversation.id) {
        return { ...conv, messages: updatedMessages, lastMessage: message, time: 'Just now' };
      }
      return conv;
    });

    setConversations(updated);
    localStorage.setItem('kindbite_conversations', JSON.stringify(updated));
    setSelectedConversation({ ...selectedConversation, messages: updatedMessages });
    setMessage('');

    setTimeout(() => {
      const response = {
        id: Date.now() + 1,
        sender: 'other',
        text: "Got it! Thanks for reaching out 👍",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      const withResponse = updated.map(conv => {
        if (conv.id === selectedConversation.id) {
          return { ...conv, messages: [...updatedMessages, response], lastMessage: response.text };
        }
        return conv;
      });

      setConversations(withResponse);
      localStorage.setItem('kindbite_conversations', JSON.stringify(withResponse));
      setSelectedConversation({ ...selectedConversation, messages: [...updatedMessages, response] });
    }, 1500);
  };

  const handleAddContact = () => {
    if (!newContactName.trim() || !newContactPhone.trim()) {
      alert('Please enter name and phone number');
      return;
    }

    const newContact = {
      id: Date.now(),
      name: newContactName,
      phone: newContactPhone,
      avatar: "👤",
      lastMessage: "Start a conversation",
      time: "Just now",
      unread: false,
      messages: []
    };

    const updated = [newContact, ...conversations];
    setConversations(updated);
    localStorage.setItem('kindbite_conversations', JSON.stringify(updated));
    
    setShowAddContact(false);
    setNewContactName('');
    setNewContactPhone('');
  };

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.phone.includes(searchTerm)
  );

  // CHAT WINDOW - Pinterest Style
  if (selectedConversation) {
    return (
      <div style={{ position: 'fixed', inset: 0, background: 'white', zIndex: 50, display: 'flex', flexDirection: 'column' }}>
        {/* Header - Pinterest Style */}
        <div style={{ 
          padding: '20px 24px',
          borderBottom: '1px solid #efefef',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'white'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button 
              onClick={() => setSelectedConversation(null)}
              style={{ 
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                border: 'none',
                background: '#f1f1f1',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.background = '#e1e1e1'}
              onMouseLeave={(e) => e.target.style.background = '#f1f1f1'}
            >
              <ArrowLeft size={20} color="#111" />
            </button>
            <div style={{ width: '48px', height: '48px', background: '#efefef', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px' }}>
              {selectedConversation.avatar}
            </div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#111', marginBottom: '2px' }}>{selectedConversation.name}</div>
              <div style={{ fontSize: '14px', color: '#767676' }}>{selectedConversation.phone}</div>
            </div>
          </div>
          <button style={{ 
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            border: 'none',
            background: '#f1f1f1',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <MoreHorizontal size={20} color="#111" />
          </button>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '32px 24px', background: '#fafafa' }}>
          {selectedConversation.messages.map((msg) => (
            <div
              key={msg.id}
              style={{ display: 'flex', justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start', marginBottom: '20px' }}
            >
              <div style={{ maxWidth: '60%' }}>
                {msg.sender === 'other' && (
                  <div style={{ fontSize: '13px', color: '#767676', marginBottom: '6px', paddingLeft: '4px' }}>
                    {selectedConversation.name}
                  </div>
                )}
                <div
                  style={{
                    padding: '14px 18px',
                    borderRadius: '24px',
                    background: msg.sender === 'user' ? '#111' : '#efefef',
                    color: msg.sender === 'user' ? 'white' : '#111',
                    fontSize: '15px',
                    lineHeight: '1.5',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                  }}
                >
                  {msg.text}
                </div>
                <div style={{ fontSize: '12px', color: '#767676', marginTop: '6px', paddingLeft: '4px' }}>
                  {msg.time}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input - Pinterest Style */}
        <div style={{ 
          padding: '20px 24px',
          borderTop: '1px solid #efefef',
          background: 'white'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px' }}>
            <button style={{ 
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              border: 'none',
              background: '#f1f1f1',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <ImageIcon size={20} color="#111" />
            </button>
            <div style={{ 
              flex: 1,
              background: '#efefef',
              borderRadius: '24px',
              padding: '12px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Send a message"
                rows={1}
                style={{ 
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  fontSize: '15px',
                  color: '#111',
                  resize: 'none',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  lineHeight: '1.5'
                }}
              />
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}>
                <Smile size={20} color="#767676" />
              </button>
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!message.trim()}
              style={{ 
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                border: 'none',
                background: message.trim() ? '#e60023' : '#f1f1f1',
                cursor: message.trim() ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                transition: 'all 0.2s'
              }}
            >
              <Send size={18} color={message.trim() ? 'white' : '#767676'} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // CONVERSATIONS LIST - Pinterest Inbox Style
  return (
    <div style={{ minHeight: '100vh', background: 'white' }}>
      <div style={{ maxWidth: '1016px', margin: '0 auto', padding: '0' }}>
        {/* Header */}
        <div style={{ padding: '32px 24px 24px 24px', borderBottom: '1px solid #efefef' }}>
          <h1 style={{ fontSize: '36px', fontWeight: '600', color: '#111', marginBottom: '24px' }}>
            Messages
          </h1>
          
          {/* Search */}
          <div style={{ position: 'relative' }}>
            <Search style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#767676' }} size={18} />
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '12px 16px 12px 48px', 
                background: '#efefef', 
                border: 'none', 
                borderRadius: '24px', 
                fontSize: '16px', 
                outline: 'none',
                color: '#111'
              }}
              onFocus={(e) => e.target.style.background = '#e1e1e1'}
              onBlur={(e) => e.target.style.background = '#efefef'}
            />
          </div>
        </div>

        {/* Conversations */}
        <div>
          {filteredConversations.length === 0 ? (
            <div style={{ padding: '120px 24px', textAlign: 'center' }}>
              <div style={{ fontSize: '64px', marginBottom: '16px', opacity: 0.3 }}>💬</div>
              <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#111', marginBottom: '8px' }}>
                No messages yet
              </h3>
              <p style={{ color: '#767676', fontSize: '16px' }}>
                Start a conversation
              </p>
              <button
                onClick={() => setShowAddContact(true)}
                style={{ 
                  marginTop: '24px',
                  padding: '12px 24px',
                  background: '#e60023',
                  color: 'white',
                  border: 'none',
                  borderRadius: '24px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Add contact
              </button>
            </div>
          ) : (
            filteredConversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => {
                  const updated = conversations.map(c => 
                    c.id === conv.id ? { ...c, unread: false } : c
                  );
                  setConversations(updated);
                  localStorage.setItem('kindbite_conversations', JSON.stringify(updated));
                  setSelectedConversation({ ...conv, unread: false });
                }}
                style={{ 
                  padding: '20px 24px',
                  borderBottom: '1px solid #efefef',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                  background: 'white'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#fafafa'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  {/* Avatar */}
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <div style={{ 
                      width: '56px', 
                      height: '56px', 
                      background: conv.unread ? '#111' : '#efefef', 
                      borderRadius: '50%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      fontSize: '28px'
                    }}>
                      {conv.avatar}
                    </div>
                    {conv.unread && (
                      <div style={{ 
                        position: 'absolute', 
                        top: '-2px', 
                        right: '-2px', 
                        width: '16px', 
                        height: '16px', 
                        background: '#e60023', 
                        borderRadius: '50%',
                        border: '3px solid white'
                      }}></div>
                    )}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <div style={{ 
                        fontSize: '16px', 
                        fontWeight: conv.unread ? '700' : '600', 
                        color: '#111',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {conv.name}
                      </div>
                      <div style={{ 
                        fontSize: '14px', 
                        color: '#767676',
                        marginLeft: '12px',
                        flexShrink: 0
                      }}>
                        {conv.time}
                      </div>
                    </div>
                    <div style={{ 
                      fontSize: '14px', 
                      color: conv.unread ? '#111' : '#767676',
                      fontWeight: conv.unread ? '600' : '400',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      marginBottom: '4px'
                    }}>
                      {conv.lastMessage}
                    </div>
                    <div style={{ fontSize: '13px', color: '#999' }}>
                      {conv.phone}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Floating Add Button - Pinterest Style */}
        <button
          onClick={() => setShowAddContact(true)}
          style={{ 
            position: 'fixed',
            bottom: '32px',
            right: '32px',
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: '#e60023',
            border: 'none',
            boxShadow: '0 4px 12px rgba(230, 0, 35, 0.3)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s',
            zIndex: 10
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.1)';
            e.target.style.boxShadow = '0 6px 20px rgba(230, 0, 35, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = '0 4px 12px rgba(230, 0, 35, 0.3)';
          }}
        >
          <Send size={24} color="white" />
        </button>
      </div>

      {/* Add Contact Modal - Pinterest Style */}
      {showAddContact && (
        <div style={{ 
          position: 'fixed', 
          inset: 0, 
          background: 'rgba(0, 0, 0, 0.6)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          zIndex: 100,
          padding: '20px'
        }}>
          <div style={{ 
            background: 'white', 
            borderRadius: '28px', 
            padding: '32px', 
            width: '100%', 
            maxWidth: '480px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              <h3 style={{ fontSize: '24px', fontWeight: '600', color: '#111' }}>Add contact</h3>
              <button 
                onClick={() => setShowAddContact(false)} 
                style={{ 
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  border: 'none',
                  background: '#f1f1f1',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X size={20} />
              </button>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#111', marginBottom: '8px' }}>
                Name
              </label>
              <input
                type="text"
                value={newContactName}
                onChange={(e) => setNewContactName(e.target.value)}
                placeholder="Enter name"
                style={{ 
                  width: '100%', 
                  padding: '14px 16px', 
                  background: '#efefef', 
                  border: 'none', 
                  borderRadius: '16px', 
                  fontSize: '16px', 
                  outline: 'none',
                  color: '#111'
                }}
                onFocus={(e) => e.target.style.background = '#e1e1e1'}
                onBlur={(e) => e.target.style.background = '#efefef'}
              />
            </div>
            
            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#111', marginBottom: '8px' }}>
                Phone number
              </label>
              <input
                type="tel"
                value={newContactPhone}
                onChange={(e) => setNewContactPhone(e.target.value)}
                placeholder="+256 XXX XXX XXX"
                style={{ 
                  width: '100%', 
                  padding: '14px 16px', 
                  background: '#efefef', 
                  border: 'none', 
                  borderRadius: '16px', 
                  fontSize: '16px', 
                  outline: 'none',
                  color: '#111'
                }}
                onFocus={(e) => e.target.style.background = '#e1e1e1'}
                onBlur={(e) => e.target.style.background = '#efefef'}
              />
            </div>
            
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setShowAddContact(false)}
                style={{ 
                  flex: 1,
                  padding: '14px',
                  background: '#efefef',
                  border: 'none',
                  borderRadius: '24px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  color: '#111',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.background = '#e1e1e1'}
                onMouseLeave={(e) => e.target.style.background = '#efefef'}
              >
                Cancel
              </button>
              <button
                onClick={handleAddContact}
                style={{ 
                  flex: 1,
                  padding: '14px',
                  background: '#e60023',
                  border: 'none',
                  borderRadius: '24px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  color: 'white',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#d0001f';
                  e.target.style.boxShadow = '0 4px 12px rgba(230, 0, 35, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#e60023';
                  e.target.style.boxShadow = 'none';
                }}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagesView;
