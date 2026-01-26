import styled from 'styled-components';
import { TextInput } from '@mantine/core';
import { useGetMessagesQuery, useSendMessageMutation } from './api/messagesApi';
import { useSelector, useDispatch } from 'react-redux';
import { setUsername } from './features/user/userSlice';
import { useState } from 'react';

// Styled Components
const Title = styled.h1`
  color: #333;
  font-size: 2rem;
  margin-bottom: 20px;
`;

const SendButton = styled.button`
  margin-top: 16px;
  padding: 10px 24px;
  font-size: 16px;
  cursor: pointer;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;

  &:hover {
    background-color: #0056b3;
  }

  &:active {
    transform: scale(0.98);
  }
`;

const MessageCard = styled.div`
  padding: 12px;
  margin-bottom: 8px;
  background-color: ${props => props.$isOwn ? '#dcf8c6' : '#f5f5f5'};
  border-radius: 8px;
  text-align: ${props => props.$isOwn ? 'right' : 'left'};
`;

function App() {
  // Redux state for username
  const username = useSelector((state) => state.user.username);
  const dispatch = useDispatch();

  // Local state for message input (temporary)
  const [messageText, setMessageText] = useState('');

  // Fetch messages with polling every 1 second
  const { data: messages, isLoading, error } = useGetMessagesQuery(undefined, {
    pollingInterval: 1000,
  });

  // Send message mutation
  const [sendMessage] = useSendMessageMutation();

  const handleSend = async () => {
    if (username && messageText) {
      await sendMessage({ userName: username, text: messageText });
      setMessageText('');
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif',
      padding: '20px'
    }}>
      <Title>Chat Client Demo</Title>

      {/* Username Input */}
      <TextInput
        name="username"
        label="Username"
        placeholder="Enter your username"
        helperText="Your display name"
        value={username}
        onChange={(e) => dispatch(setUsername(e.target.value))}
      />

      {/* Message Input */}
      <div style={{ marginTop: '16px', width: '300px' }}>
        <TextInput
          name="message"
          label="Message"
          placeholder="Type a message..."
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          disabled={!username}
        />
      </div>

      {/* Send Button */}
      <SendButton onClick={handleSend} disabled={!username || !messageText}>
        Send Message
      </SendButton>

      {/* Messages List */}
      <div style={{ marginTop: '32px', width: '100%', maxWidth: '500px' }}>
        <h2>Messages</h2>

        {isLoading && <p>Loading messages...</p>}

        {error && <p style={{ color: 'red' }}>Error loading messages</p>}

        {messages && messages.map((msg, index) => (
          <MessageCard key={index} $isOwn={msg.userName === username}>
            <strong>{msg.userName}</strong>
            <span style={{ color: '#666', marginLeft: '8px', fontSize: '12px' }}>
              {new Date(msg.createdAt).toLocaleString()}
            </span>
            <p style={{ margin: '8px 0 0 0' }}>{msg.text}</p>
          </MessageCard>
        ))}

        {messages && messages.length === 0 && (
          <p style={{ color: '#666' }}>No messages yet. Send the first one!</p>
        )}
      </div>
    </div>
  );
}

export default App;
