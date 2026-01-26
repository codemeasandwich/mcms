# Step 5: Styled Components

Learn CSS-in-JS by adding styled-components to 3 elements. Each demonstrates a different feature.

---

## Install

```bash
npm install styled-components
```

**Check it worked:** Look in `package.json` for `"styled-components"` in dependencies.

---

## Import

Add to top of `src/App.jsx`:

```javascript
import styled from 'styled-components';
```

---

## 1. Basic Styled Component: Title

**Feature:** Writing CSS in a template literal

Create this **above** `function App()`:

```javascript
const Title = styled.h1`
  color: #333;
  font-size: 2rem;
  margin-bottom: 20px;
`;
```

Find this line:
```jsx
<h1>Chat Client Demo</h1>
```

Replace with:
```jsx
<Title>Chat Client Demo</Title>
```

**Key concept:** `styled.h1` creates a React component that renders an `<h1>`. CSS goes inside backticks using real CSS syntax (kebab-case, not camelCase).

---

## 2. Pseudo-selectors: SendButton

**Feature:** Using `&` for hover/active states

Add this styled component:

```javascript
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
```

Find the button:
```jsx
<button
  onClick={handleSend}
  style={{
    marginTop: '16px',
    padding: '10px 24px',
    fontSize: '16px',
    cursor: 'pointer'
  }}
>
  Send Message
</button>
```

Replace with:
```jsx
<SendButton onClick={handleSend}>
  Send Message
</SendButton>
```

**Key concept:** `&` refers to the component itself. Use it for pseudo-selectors like `:hover`, `:focus`, `:active`, `:first-child`, etc.

---

## 3. Props-based Styling: MessageCard

**Feature:** Dynamic styles based on props

Add this styled component:

```javascript
const MessageCard = styled.div`
  padding: 12px;
  margin-bottom: 8px;
  background-color: ${props => props.$isOwn ? '#dcf8c6' : '#f5f5f5'};
  border-radius: 8px;
  text-align: ${props => props.$isOwn ? 'right' : 'left'};
`;
```

Find the message div:
```jsx
<div
  key={index}
  style={{
    padding: '12px',
    marginBottom: '8px',
    backgroundColor: '#f5f5f5',
    borderRadius: '8px'
  }}
>
```

Replace with:
```jsx
<MessageCard key={index} $isOwn={msg.userName === username}>
```

Don't forget to change the closing `</div>` to `</MessageCard>`.

**Key concept:** Access props inside `${}` using arrow functions. Prefix custom props with `$` (transient props) to prevent them from being passed to the DOM element.

---

## Verify Your Changes

1. Run `npm start`
2. **Title** should have the new styling (dark grey, 2rem)
3. **Button** should change color on hover and shrink slightly on click
4. **Your own messages** should appear green and right-aligned (other users' messages stay grey and left-aligned)

---

## What You Learned

| Feature | Example | Use Case |
|---------|---------|----------|
| Basic styling | `styled.h1\`...\`` | Any static CSS |
| Pseudo-selectors | `&:hover { }` | Interactive states |
| Props-based styling | `${props => ...}` | Dynamic/conditional styles |

---

## After Step 5: App.jsx

Your App.jsx should now have these imports and styled components at the top:

```jsx
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
  const username = useSelector((state) => state.user.username);
  const dispatch = useDispatch();
  const [messageText, setMessageText] = useState('');
  const { data: messages, isLoading, error } = useGetMessagesQuery(undefined, {
    pollingInterval: 1000,
  });
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

      <TextInput
        name="username"
        label="Username"
        placeholder="Enter your username"
        helperText="Your display name"
        value={username}
        onChange={(e) => dispatch(setUsername(e.target.value))}
      />

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

      <SendButton onClick={handleSend} disabled={!username || !messageText}>
        Send Message
      </SendButton>

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
```
