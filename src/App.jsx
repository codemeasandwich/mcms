import { TextInput } from '@mantine/core';

function App() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      fontFamily: 'Arial, sans-serif',
      padding: '20px'
    }}>
      <h1>Chat Client Demo</h1>

      <TextInput
        name="username"
        label="Username"
        placeholder="Enter your username"
        helperText="This is a sample text input"
      />
    </div>
  );
}

export default App;
