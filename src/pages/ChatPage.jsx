import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import './ChatPage.css';

const ChatPage = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your AI assistant. I can help you with movie and book recommendations, answer questions, or just chat! What would you like to know?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Initialize Gemini AI
  const genAI = new GoogleGenerativeAI('AIzaSyCPSe9kJziYF__niVQ__sFIUk3hpByMokk');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Use the working model we found
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
      console.log('Using working model: gemini-2.0-flash-exp');
      
      // Enhanced prompt for better, neater responses
      let prompt = `You are a helpful AI assistant for a movie and book recommendation app. The user said: "${inputMessage}". `;
      
      const lowerInput = inputMessage.toLowerCase();
      if (lowerInput.includes('vijay') || lowerInput.includes('movie') || lowerInput.includes('film')) {
        prompt += `Please provide helpful movie recommendations. If they mentioned "Vijay", they're likely asking about Tamil actor Vijay's movies. 
        
IMPORTANT: DO NOT use asterisks (*) or markdown formatting. Write your response in plain text with:
- Clear headings or sections
- Use dashes (-) instead of asterisks for bullet points
- Brief but informative descriptions
- Clean, readable formatting without special characters
Keep it concise and easy to read.`;
      } else if (lowerInput.includes('book') || lowerInput.includes('novel')) {
        prompt += `Please provide helpful book recommendations with specific titles and brief descriptions. 
        
IMPORTANT: DO NOT use asterisks (*) or markdown formatting. Use dashes (-) for lists and plain text formatting only.
Keep it concise and easy to read.`;
      } else {
        prompt += `Please respond in a friendly, helpful manner about movies or books. Format your response neatly with plain text (no asterisks or markdown), use dashes (-) for lists, and make it easy to read.`;
      }

      console.log('Sending request to Gemini API...');
      const result = await model.generateContent(prompt);
      const response = await result.response;
      let text = response.text();
      
      // Clean up asterisks and markdown formatting
      text = text.replace(/\*\*/g, ''); // Remove ** for bold
      text = text.replace(/\*/g, '-'); // Replace single * with - for lists
      text = text.replace(/^\-\s+/gm, '- '); // Ensure proper dash formatting
      
      console.log('Received response from Gemini API:', text);

      const aiMessage = {
        id: Date.now() + 1,
        text: text,
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      console.error('Error details:', error.message);
      
      // More specific error handling
      let errorText = "Sorry, I'm having trouble connecting right now. Please try again later.";
      
      if (error.message.includes('API_KEY')) {
        errorText = "There's an issue with the API configuration. Please check the API key.";
      } else if (error.message.includes('quota')) {
        errorText = "API quota exceeded. Please try again later.";
      } else if (error.message.includes('network')) {
        errorText = "Network error. Please check your internet connection.";
      }
      
      const errorMessage = {
        id: Date.now() + 1,
        text: errorText,
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };


  return (
    <div className="chat-page">
      <div className="chat-content">
        <div className="ai-chat">
            <div className="chat-messages">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`message ${message.sender === 'user' ? 'user-message' : 'ai-message'}`}
                >
                  <div className="message-content">
                    <div className="message-text">{message.text}</div>
                    <div className="message-time">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="message ai-message">
                  <div className="message-content">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <div className="chat-input">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message here..."
                disabled={isLoading}
                rows="1"
              />
              <button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="send-button"
              >
                {isLoading ? '⏳' : '➤'}
              </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
