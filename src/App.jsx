function App() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      fontFamily: 'Arial, sans-serif',
      padding: '20px'
    }}>
      <h1>Chat Client</h1>

      <div style={{
        flex: 1,
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '10px',
        marginBottom: '10px',
        overflowY: 'auto'
      }}>
        {/* Messages will appear here */}
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <input
          type="text"
          placeholder="Type a message..."
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: '4px',
            border: '1px solid #ccc'
          }}
        />
        <button style={{
          padding: '10px 20px',
          borderRadius: '4px',
          border: 'none',
          backgroundColor: '#007bff',
          color: 'white',
          cursor: 'pointer'
        }}>
          Send
        </button>
      </div>
    </div>
  );
}

export default App;
