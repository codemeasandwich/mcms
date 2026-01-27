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
