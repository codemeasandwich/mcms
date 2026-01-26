import { TextInput } from '@mantine/core';
import { useGetMessagesQuery, useSendMessageMutation } from './api/messagesApi';
import { useSelector, useDispatch } from 'react-redux';
import { setUsername } from './features/user/userSlice';
import { useState } from 'react';

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
      <h1>Chat Client Demo</h1>

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
      <button
        onClick={handleSend}
        disabled={!username || !messageText}
        style={{
          marginTop: '16px',
          padding: '10px 24px',
          fontSize: '16px',
          cursor: 'pointer'
        }}
      >
        Send Message
      </button>

      {/* Messages List */}
      <div style={{ marginTop: '32px', width: '100%', maxWidth: '500px' }}>
        <h2>Messages</h2>

        {isLoading && <p>Loading messages...</p>}

        {error && <p style={{ color: 'red' }}>Error loading messages</p>}

        {messages && messages.map((msg, index) => (
          <div
            key={index}
            style={{
              padding: '12px',
              marginBottom: '8px',
              backgroundColor: '#f5f5f5',
              borderRadius: '8px'
            }}
          >
            <strong>{msg.userName}</strong>
            <span style={{ color: '#666', marginLeft: '8px', fontSize: '12px' }}>
              {new Date(msg.createdAt).toLocaleString()}
            </span>
            <p style={{ margin: '8px 0 0 0' }}>{msg.text}</p>
          </div>
        ))}

        {messages && messages.length === 0 && (
          <p style={{ color: '#666' }}>No messages yet. Send the first one!</p>
        )}
      </div>
    </div>
  );
}

export default App;
