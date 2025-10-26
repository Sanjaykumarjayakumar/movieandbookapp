import React, { useState } from 'react';
import './ChatPage.css';

const ChatPage = () => {
  const [activeTab, setActiveTab] = useState('groups');

  return (
    <div className="chat-page">
      <div className="chat-nav">
        <button
          className={activeTab === 'groups' ? 'active' : ''}
          onClick={() => setActiveTab('groups')}
        >
          Groups
        </button>
        <button
          className={activeTab === 'ai' ? 'active' : ''}
          onClick={() => setActiveTab('ai')}
        >
          AI
        </button>
      </div>
      <div className="chat-content">
        {activeTab === 'groups' && (
          <div className="no-groups-message">
            <p>No groups at the moment</p>
          </div>
        )}
        {activeTab === 'ai' && (
          <div className="ai-chat">
            {/* AI chat interface will go here */}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
