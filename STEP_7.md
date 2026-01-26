# Step 7: React Router

Learn client-side routing by adding navigation between a Home page and Chat page.

---

## Install

```bash
npm install react-router-dom
```

**Check it worked:** Look in `package.json` for `"react-router-dom"` in dependencies.

---

## 1. Wrap App with BrowserRouter

**Feature:** Enable routing in your app

In `src/index.js`, add the import:

```javascript
import { BrowserRouter } from 'react-router-dom';
```

Then wrap `<App />` with `<BrowserRouter>`:

```jsx
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);
```

**Key concept:** `BrowserRouter` uses the HTML5 history API to keep your UI in sync with the URL. It must wrap any components that use routing.

---

## 2. Create Page Components

**Feature:** Organize your app into separate pages

Create this folder structure:
```
src/
  pages/
    Home.jsx
    Chat.jsx
```

### Home Page (`src/pages/Home.jsx`)

```jsx
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  font-family: Arial, sans-serif;
`;

const Title = styled.h1`
  color: #333;
  font-size: 2.5rem;
  margin-bottom: 16px;
`;

const NavLink = styled(Link)`
  padding: 12px 24px;
  background-color: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-size: 16px;

  &:hover {
    background-color: #0056b3;
  }
`;

function Home() {
  return (
    <Container>
      <Title>Welcome</Title>
      <p style={{ marginBottom: '24px', color: '#666' }}>
        This is My Chat Client.
      </p>
      <NavLink to="/chat">Go to Chat</NavLink>
    </Container>
  );
}

export default Home;
```

**Key concept:** `Link` is like an `<a>` tag but prevents page reload. `styled(Link)` applies styled-components to the Link.

---

### Chat Page (`src/pages/Chat.jsx`)

Move all your current chat code from `App.jsx` into this new file:

```jsx
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { TextInput } from '@mantine/core';
import { useGetMessagesQuery, useSendMessageMutation } from '../api/messagesApi';
import { useSelector, useDispatch } from 'react-redux';
import { setUsername } from '../features/user/userSlice';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

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

const LanguageButton = styled.button`
  padding: 8px 16px;
  margin: 0 4px;
  border: 2px solid ${props => props.$active ? '#007bff' : '#ccc'};
  background: ${props => props.$active ? '#007bff' : 'white'};
  color: ${props => props.$active ? 'white' : '#333'};
  border-radius: 4px;
  cursor: pointer;
  font-weight: ${props => props.$active ? 'bold' : 'normal'};
`;

const BackLink = styled(Link)`
  position: absolute;
  top: 20px;
  left: 20px;
  color: #007bff;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

function Chat() {
  const { t, i18n } = useTranslation();

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
      padding: '20px',
      position: 'relative'
    }}>
      <BackLink to="/">&larr; Back to Home</BackLink>

      <Title>{t('title')}</Title>

      <div style={{ marginBottom: '16px' }}>
        <LanguageButton
          $active={i18n.language === 'en'}
          onClick={() => i18n.changeLanguage('en')}
        >
          English
        </LanguageButton>
        <LanguageButton
          $active={i18n.language === 'pirate'}
          onClick={() => i18n.changeLanguage('pirate')}
        >
          Pirate
        </LanguageButton>
      </div>

      {/* Username Input */}
      <TextInput
        name="username"
        label={t('username.label')}
        placeholder={t('username.placeholder')}
        description={t('username.helper')}
        value={username}
        onChange={(e) => dispatch(setUsername(e.target.value))}
      />

      {/* Message Input */}
      <div style={{ marginTop: '16px', width: '300px' }}>
        <TextInput
          name="message"
          label={t('message.label')}
          placeholder={t('message.placeholder')}
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          disabled={!username}
        />
      </div>

      {/* Send Button */}
      <SendButton onClick={handleSend} disabled={!username || !messageText}>
        {t('send')}
      </SendButton>

      {/* Messages List */}
      <div style={{ marginTop: '32px', width: '100%', maxWidth: '500px' }}>
        <h2>{t('messages.title')}</h2>

        {isLoading && <p>{t('messages.loading')}</p>}

        {error && <p style={{ color: 'red' }}>{t('messages.error')}</p>}

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
          <p style={{ color: '#666' }}>{t('messages.empty')}</p>
        )}
      </div>
    </div>
  );
}

export default Chat;
```

**Key concept:** Note the import paths changed from `'./api/...'` to `'../api/...'` because we moved into a `pages/` subfolder.

---

## 3. Set Up Routes in App.jsx

**Feature:** Define which component renders at each URL

Replace your entire `src/App.jsx` with:

```jsx
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Chat from './pages/Chat';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/chat" element={<Chat />} />
    </Routes>
  );
}

export default App;
```

**Key concepts:**
- `Routes` is the container for all your route definitions
- `Route` maps a URL path to a component
- `element` prop takes a JSX element (not just a component name)

---

## Verify Your Changes

1. Run `npm start`
2. Browser opens to Home page at `http://localhost:3000/`
3. Click "Go to Chat" - navigates to `/chat` without page reload
4. Chat page works as before (i18n, messages, etc.)
5. Click "Back to Home" - returns to home page
6. Use browser back/forward buttons - navigation works
7. Type `http://localhost:3000/chat` directly - Chat page loads

---

## What You Learned

| Feature | Example | Use Case |
|---------|---------|----------|
| BrowserRouter | `<BrowserRouter><App /></BrowserRouter>` | Enable routing |
| Routes | `<Routes>...</Routes>` | Container for routes |
| Route | `<Route path="/chat" element={<Chat />} />` | Map URL to component |
| Link | `<Link to="/chat">` | Navigate without reload |
| styled(Link) | `styled(Link)\`...\`` | Style a Link component |

---

## After Step 7: index.js

```jsx
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from './store';
import './i18n';
import App from './App';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);
```

---

## After Step 7: App.jsx

```jsx
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Chat from './pages/Chat';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/chat" element={<Chat />} />
    </Routes>
  );
}

export default App;
```
