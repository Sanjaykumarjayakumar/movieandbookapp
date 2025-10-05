import React, { useState } from "react";
import "./ChatPage.css"; // Import the stylesheet

const ChatPage = () => {
  const [chatOption, setChatOption] = useState(null);
  const [groups, setGroups] = useState([]);
  const [newGroupInfo, setNewGroupInfo] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const generateCode = () => String(Math.floor(100000 + Math.random() * 900000));

  const handleStartCreateGroup = () => {
    setNewGroupInfo({ name: "", code: generateCode() });
    setShowSuccessMessage(false); // Reset success message
  };

  const handleGroupNameChange = (e) => {
    setNewGroupInfo((prev) => ({ ...prev, name: e.target.value }));
  };

  const handleSaveGroup = () => {
    if (!newGroupInfo || !newGroupInfo.name.trim()) {
      alert("Please enter a group name.");
      return;
    }
    setGroups((prevGroups) => [...prevGroups, newGroupInfo]);
    setNewGroupInfo(null);
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000); // Hide after 3 seconds
  };

  const handleCancelCreateGroup = () => {
    setNewGroupInfo(null);
  };

  return (
    <div className="chat-container">
      <h1>Chat</h1>

      {!chatOption && (
        <div className="chat-options">
          <button onClick={() => setChatOption("ai")}>Chat with AI</button>
          <button onClick={() => setChatOption("friends")}>
            Chat with Friends
          </button>
        </div>
      )}

      {chatOption === "ai" && (
        <div className="ai-chat">
          <button onClick={() => setChatOption(null)}>⬅ Back</button>
          <h2>AI Chat</h2>
          <div className="chat-box">
            <p>🤖 Hello! I am your AI assistant.</p>
          </div>
          <input type="text" placeholder="Type your message..." />
          <button>Send</button>
        </div>
      )}

      {chatOption === "friends" && (
        <div className="friends-chat">
          <button onClick={() => setChatOption(null)}>⬅ Back</button>
          <h2>Chat with Friends</h2>

          {!newGroupInfo ? (
            <button className="create-btn" onClick={handleStartCreateGroup}>
              Create Group
            </button>
          ) : (
            <div className="create-group">
              <p>
                Group Code: <strong>{newGroupInfo.code}</strong>
              </p>
              <input
                type="text"
                placeholder="Enter group name"
                value={newGroupInfo.name}
                onChange={handleGroupNameChange}
              />
              <button onClick={handleSaveGroup}>Save Group</button>
              <button onClick={handleCancelCreateGroup}>Cancel</button>
            </div>
          )}

          {showSuccessMessage && (
            <p className="success-message">Group created successfully!</p>
          )}

          {groups.length > 0 && (
            <div className="group-list">
              <h3>My Groups</h3>
              {groups.map((group) => (
                <div key={group.code} className="group-card">
                  <p>📌 {group.name}</p>
                  <p>Code: {group.code}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatPage;
