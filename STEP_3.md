# Step 3: Connect to Server with RTK Query

This step introduces RTK Query (Redux Toolkit Query) to fetch and send messages to the server.

**Server API (already running on port 3030):**

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/messages` | GET | Get all messages |
| `/messages?from=date` | GET | Get messages after date |
| `/messages` | POST | Save new message |

**Message shape:** `{ userName: string, text: string, createdAt: date }`

---

## Step 3.1: Install RTK Query Dependencies

Open your terminal in the project root folder and run:

```bash
npm install @reduxjs/toolkit react-redux
```

**What this does:**
- `@reduxjs/toolkit` - Includes RTK Query for data fetching
- `react-redux` - Connects Redux to React components

---

## Step 3.2: Create the API Slice

Create a new file `src/api/messagesApi.js`:

```javascript
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const messagesApi = createApi({
  reducerPath: 'messagesApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3030' }),
  tagTypes: ['Messages'],
  endpoints: (builder) => ({
    // GET /messages
    getMessages: builder.query({
      query: () => '/messages',
      providesTags: ['Messages'],
    }),

    // POST /messages
    sendMessage: builder.mutation({
      query: (newMessage) => ({
        url: '/messages',
        method: 'POST',
        body: newMessage,
      }),
      invalidatesTags: ['Messages'],
    }),
  }),
});

export const { useGetMessagesQuery, useSendMessageMutation } = messagesApi;
```

**Understanding each part:**

| Code | Purpose |
|------|---------|
| `createApi` | Creates an API slice with endpoints |
| `fetchBaseQuery` | Built-in fetch wrapper with baseUrl |
| `reducerPath` | Unique key for this API in Redux store |
| `tagTypes` | Labels for cache invalidation |
| `builder.query` | Defines a GET request |
| `builder.mutation` | Defines a POST/PUT/DELETE request |
| `providesTags` | Marks cached data with a tag |
| `invalidatesTags` | Refetches data with this tag after mutation |

**Auto-generated hooks:**
- `useGetMessagesQuery` - Fetches messages on component mount
- `useSendMessageMutation` - Returns function to send messages

---

## Step 3.3: Create the Redux Store

Create a new file `src/store.js`:

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

**Understanding each part:**

| Code | Purpose |
|------|---------|
| `configureStore` | Creates Redux store with good defaults |
| `reducer` | Adds the API slice reducer to the store |
| `middleware` | Adds RTK Query middleware for caching & refetching |

---

## Step 3.4: Wrap App with Redux Provider

Update `src/index.js`:

```javascript
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store';
import App from './App';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
```

**What this does:**
- `Provider` makes the Redux store available to all components
- Any component can now use RTK Query hooks

---

## Step 3.5: Update App to Display Messages

Update `src/App.jsx`:

```jsx
import { TextInput } from '@mantine/core';
import { useGetMessagesQuery, useSendMessageMutation } from './api/messagesApi';
import { useState } from 'react';

function App() {
  const [username, setUsername] = useState('');
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
        onChange={(e) => setUsername(e.target.value)}
      />

      {/* Message Input */}
      <div style={{ marginTop: '16px', width: '300px' }}>
        <TextInput
          name="message"
          label="Message"
          placeholder="Type a message..."
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
        />
      </div>

      {/* Send Button */}
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

**Understanding the RTK Query hooks:**

| Hook Return | Purpose |
|-------------|---------|
| `data` | The fetched messages array |
| `isLoading` | `true` while initial fetch is in progress |
| `error` | Error object if request failed |
| `sendMessage()` | Function to POST a new message |

**What happens automatically:**
1. `useGetMessagesQuery()` fetches messages when component mounts
2. With `pollingInterval: 1000`, messages are refetched every second for real-time updates
3. After `sendMessage()` succeeds, `invalidatesTags: ['Messages']` triggers an immediate refetch
4. UI updates automatically with new messages

---

## Step 3.6: Run the Development Server

Make sure the backend server is running on port 3030, then start your React app:

```bash
npm start
```

---

## What You Should See After Step 3

Open your browser to `http://localhost:3000`. You should see:

1. **Page Title:** "Chat Client Demo"
2. **Username Input:** Text field for entering your name
3. **Message Input:** Text field for typing messages
4. **Send Button:** Submits the message to the server
5. **Messages List:** Displays all messages from the server with:
   - Username in bold
   - Timestamp
   - Message text

**Test it:**
1. Enter a username
2. Type a message
3. Click "Send Message"
4. Message appears in the list (fetched from server)

---

## Project Structure After Step 3

```
project/
├── public/
│   └── index.html
├── src/
│   ├── api/
│   │   └── messagesApi.js    ← NEW: RTK Query API slice
│   ├── index.js              ← MODIFIED: Added Provider
│   ├── store.js              ← NEW: Redux store
│   └── App.jsx               ← MODIFIED: Uses RTK Query hooks
├── .babelrc
├── package.json
└── webpack.config.js
```

---

## File Changes Summary

| File | Change |
|------|--------|
| `package.json` | Added `@reduxjs/toolkit`, `react-redux` |
| `src/api/messagesApi.js` | NEW - API slice with endpoints |
| `src/store.js` | NEW - Redux store configuration |
| `src/index.js` | Wrapped App with Provider |
| `src/App.jsx` | Added RTK Query hooks and UI |

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `CORS error` in console | Server needs CORS headers enabled |
| `Network error` | Verify server is running on port 3030 |
| Messages not refreshing | Check `invalidatesTags` matches `providesTags` |
| `Store does not have a valid reducer` | Verify store.js imports messagesApi correctly |

---

## RTK Query Hooks Reference

| Hook | Returns | Purpose |
|------|---------|---------|
| `useGetMessagesQuery()` | `{ data, isLoading, error, refetch }` | Fetch messages on mount |
| `useSendMessageMutation()` | `[sendFn, { isLoading, error }]` | Send new message |

**Additional query options:**

```javascript
// Polling every 5 seconds
const { data } = useGetMessagesQuery(undefined, {
  pollingInterval: 5000,
});

// Skip fetching until ready
const { data } = useGetMessagesQuery(undefined, {
  skip: !isReady,
});
```

---

## Server API Reference

**Get all messages:**
```bash
curl http://localhost:3030/messages
```

**Get messages after date:**
```bash
curl "http://localhost:3030/messages?from=2024-01-01"
```

**Send a message:**
```bash
curl -X POST http://localhost:3030/messages \
  -H "Content-Type: application/json" \
  -d '{"userName":"alice","text":"hello"}'
```

---

## Verification Checklist

- [ ] `npm install` completed without errors
- [ ] `src/api/messagesApi.js` created
- [ ] `src/store.js` created
- [ ] `src/index.js` has Provider wrapper
- [ ] App loads without console errors
- [ ] "Loading messages..." appears briefly
- [ ] Messages from server display in list
- [ ] Sending a message adds it to the list
- [ ] Page auto-refreshes after sending
