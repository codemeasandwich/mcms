# Step 6: i18next (Internationalization)

Learn internationalization (i18n) by adding multi-language support. We'll add English and Pirate translations with a language switcher.

---

## Install

```bash
npm install i18next react-i18next
```

**Check it worked:** Look in `package.json` for `"i18next"` and `"react-i18next"` in dependencies.

---

## 1. Create Translation Files

Create this folder structure:
```
src/
  i18n/
    index.js
    locales/
      en.json
      pirate.json
```

### English Translations (`src/i18n/locales/en.json`)

```json
{
  "title": "Chat Client Demo",
  "username": {
    "label": "Username",
    "placeholder": "Enter your username",
    "helper": "Your display name"
  },
  "message": {
    "label": "Message",
    "placeholder": "Type a message..."
  },
  "send": "Send Message",
  "messages": {
    "title": "Messages",
    "loading": "Loading messages...",
    "error": "Error loading messages",
    "empty": "No messages yet. Send the first one!"
  }
}
```

### Pirate Translations (`src/i18n/locales/pirate.json`)

```json
{
  "title": "Pirate Ship Communications",
  "username": {
    "label": "Yer Name",
    "placeholder": "What be yer name, matey?",
    "helper": "How ye be known on the seven seas"
  },
  "message": {
    "label": "Message in a Bottle",
    "placeholder": "Speak yer mind, scallywag..."
  },
  "send": "Fire Away!",
  "messages": {
    "title": "Ship's Log",
    "loading": "Fetchin' messages from Davy Jones...",
    "error": "Blimey! The messages be lost at sea!",
    "empty": "Arr! No messages yet. Be the first to hoist the colors!"
  }
}
```

**Key concept:** Translation files use nested objects. Access nested keys with dots: `t('username.label')`.

---

## 2. Configure i18next

Create `src/i18n/index.js`:

```javascript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import pirate from './locales/pirate.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      pirate: { translation: pirate }
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
```

**Key concepts:**
- `use(initReactI18next)` - Connects i18n to React
- `lng` - Default language
- `fallbackLng` - Used when translation is missing
- `escapeValue: false` - React already escapes, no need for i18n to do it

---

## 3. Import i18n in Entry Point

In `src/index.js`, add this import near the top (before the App import):

```javascript
import './i18n';
```

**Key concept:** Importing the config file runs the initialization. Must happen before App renders.

---

## 4. Add Language Switcher Component

In `src/App.jsx`, add this styled component with the others:

```javascript
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
```

**Key concept:** Uses transient prop `$active` for conditional styling (same pattern as MessageCard's `$isOwn`).

---

## 5. Use Translations in App

### Add import at top of App.jsx:

```javascript
import { useTranslation } from 'react-i18next';
```

### Add hook inside App function (at the top with other hooks):

```javascript
const { t, i18n } = useTranslation();
```

**Key concept:** `t` is the translation function, `i18n` gives access to change language.

---

## 6. Replace Hardcoded Strings

Find and replace these strings in the JSX:

| Find | Replace With |
|------|--------------|
| `>Chat Client Demo<` | `>{t('title')}<` |
| `label="Username"` | `label={t('username.label')}` |
| `placeholder="Enter your username"` | `placeholder={t('username.placeholder')}` |
| `helperText="Your display name"` | `helperText={t('username.helper')}` |
| `label="Message"` | `label={t('message.label')}` |
| `placeholder="Type a message..."` | `placeholder={t('message.placeholder')}` |
| `>Send Message<` | `>{t('send')}<` |
| `>Messages<` | `>{t('messages.title')}<` |
| `>Loading messages...<` | `>{t('messages.loading')}<` |
| `>Error loading messages<` | `>{t('messages.error')}<` |
| `>No messages yet. Send the first one!<` | `>{t('messages.empty')}<` |

---

## 7. Add Language Switcher UI

After the `<Title>` element, add:

```jsx
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
```

**Key concept:** `i18n.changeLanguage()` triggers a re-render with new translations.

---

## Verify Your Changes

1. Run `npm start`
2. Page loads with English text
3. Click "Pirate" button - all text changes to pirate speak
4. Click "English" button - text reverts to English
5. Try typing in the inputs and sending messages - labels should translate but your typed content stays the same

---

## What You Learned

| Feature | Example | Use Case |
|---------|---------|----------|
| Translation function | `t('key')` | Static text |
| Nested keys | `t('username.label')` | Organized translations |
| Language switching | `i18n.changeLanguage('pirate')` | Runtime language change |
| Current language | `i18n.language` | Conditional styling |

---

## After Step 6: App.jsx

Your App.jsx should now have these imports and styled components at the top:

```jsx
import styled from 'styled-components';
import { TextInput } from '@mantine/core';
import { useGetMessagesQuery, useSendMessageMutation } from './api/messagesApi';
import { useSelector, useDispatch } from 'react-redux';
import { setUsername } from './features/user/userSlice';
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

function App() {
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
      padding: '20px'
    }}>
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
        helperText={t('username.helper')}
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

export default App;
```
