# Step 4: Redux Toolkit Slices for Local State

## What You Have After Step 3

After completing steps 1-3, your project has:

**Project Structure:**
```
project/
├── public/
│   └── index.html
├── src/
│   ├── api/
│   │   └── messagesApi.js    ← RTK Query API slice
│   ├── App.jsx               ← Main component with TextInput
│   ├── index.js              ← Provider wrapper
│   └── store.js              ← Redux store (RTK Query only)
├── .babelrc
├── package.json
└── webpack.config.js
```

**Current Files:**

`src/store.js`:
```javascript
import { configureStore } from '@reduxjs/toolkit';
import { messagesApi } from './api/messagesApi';

export const store = configureStore({
  reducer: {
    [messagesApi.reducerPath]: messagesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(messagesApi.middleware),
});
```

`src/App.jsx` uses `useState` for local state:
```javascript
const [username, setUsername] = useState('');
const [messageText, setMessageText] = useState('');
```

---

## Step 4: Add a Redux Slice

**Goal:** Move `username` from component state to Redux using `createSlice`.

**Why move username to Redux?**
- Username persists across messages (good for global state)
- `messageText` stays as `useState` (temporary input, cleared after send)

---

## Step 4.1: Create the User Slice

Create the folder and file `src/features/user/userSlice.js`:

```javascript
import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    username: '',
  },
  reducers: {
    setUsername: (state, action) => {
      state.username = action.payload;
    },
  },
});

export const { setUsername } = userSlice.actions;
export default userSlice.reducer;
```

**Understanding each part:**

| Code | Purpose |
|------|---------|
| `createSlice` | Creates reducer + actions in one step |
| `name: 'user'` | Prefix for action types (e.g., `user/setUsername`) |
| `initialState` | Default state when app loads |
| `reducers` | Functions that update state |
| `state.username = action.payload` | Immer allows "mutating" syntax safely |
| `userSlice.actions` | Auto-generated action creators |
| `userSlice.reducer` | The reducer function for the store |

---

## Step 4.2: Add Slice to Store

Update `src/store.js`:

```javascript
import { configureStore } from '@reduxjs/toolkit';
import { messagesApi } from './api/messagesApi';
import userReducer from './features/user/userSlice';

export const store = configureStore({
  reducer: {
    [messagesApi.reducerPath]: messagesApi.reducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(messagesApi.middleware),
});
```

**What changed:**
- Imported `userReducer` from the slice
- Added `user: userReducer` to the reducer object

**State shape is now:**
```javascript
{
  messagesApi: { ... },  // RTK Query cache
  user: { username: '' } // Our slice
}
```

---

## Step 4.3: Update App Component

Update `src/App.jsx`:

```jsx
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
```

**What changed:**

| Before (useState) | After (Redux) |
|-------------------|---------------|
| `const [username, setUsername] = useState('')` | `const username = useSelector((state) => state.user.username)` |
| `setUsername(e.target.value)` | `dispatch(setUsername(e.target.value))` |

**New imports:**
- `useSelector` - Reads state from Redux store
- `useDispatch` - Returns dispatch function
- `setUsername` - Action creator from our slice

---

## Project Structure After Step 4

```
project/
├── src/
│   ├── api/
│   │   └── messagesApi.js
│   ├── features/
│   │   └── user/
│   │       └── userSlice.js    ← NEW
│   ├── App.jsx                  ← MODIFIED
│   ├── index.js
│   └── store.js                 ← MODIFIED
```

---

## File Changes Summary

| File | Change |
|------|--------|
| `src/features/user/userSlice.js` | NEW - Redux slice for user state |
| `src/store.js` | Added userReducer to store |
| `src/App.jsx` | Replaced useState with useSelector/useDispatch |

---

## Redux vs useState Comparison

| Aspect | useState | Redux Slice |
|--------|----------|-------------|
| **Scope** | Single component | Entire app |
| **Access** | Props drilling needed | useSelector anywhere |
| **Persistence** | Lost on unmount | Survives component lifecycle |
| **DevTools** | Not visible | Full inspection |
| **Use for** | Temporary/local UI state | Shared app state |

---

## Key Concepts

### useSelector
Reads state from the Redux store:
```javascript
const username = useSelector((state) => state.user.username);
//                                      ↑ slice  ↑ property
```

### useDispatch
Sends actions to update the store:
```javascript
const dispatch = useDispatch();
dispatch(setUsername('alice'));
//       ↑ action creator from slice
```

### createSlice Anatomy
```javascript
createSlice({
  name: 'user',           // Action prefix
  initialState: { ... },  // Default values
  reducers: {             // State update functions
    setUsername: (state, action) => {
      state.username = action.payload;
    }
  }
})
```

---

## Verification Checklist

- [ ] Created `src/features/user/userSlice.js`
- [ ] Updated `src/store.js` with userReducer
- [ ] Updated `src/App.jsx` with useSelector/useDispatch
- [ ] App loads without errors
- [ ] Username input still works
- [ ] Messages still send correctly
- [ ] Username persists while navigating (if applicable)
- [ ] Message input is disabled when username is empty
- [ ] Send button is disabled when username or message is empty

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `Cannot read property 'username' of undefined` | Check store has `user: userReducer` |
| `setUsername is not a function` | Verify import: `import { setUsername } from './features/user/userSlice'` |
| Username not updating | Ensure `dispatch(setUsername(...))` not just `setUsername(...)` |
| `useSelector` returns undefined | Check the selector path matches store shape |

---

## Next Steps

Now that you understand Redux slices, you can:
- Add more slices for other app state (e.g., theme, filters)
- Use Redux DevTools to inspect state changes
- Learn about async thunks with `createAsyncThunk`
