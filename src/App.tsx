import { ChatInterface } from './components/ChatInterface';
import styled from '@emotion/styled';
import { Global, css } from '@emotion/react';

const globalStyles = css`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    color: #ffffff;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    background-color: #1a1a1a;
  }
`;

// 반응형 디자인을 위한 브레이크포인트
const breakpoints = {
  mobile: '360px',
  tablet: '768px',
};

const AppContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;

  @media (max-width: ${breakpoints.mobile}) {
    padding: 0;
  }

  @media (min-width: ${breakpoints.mobile}) and (max-width: ${breakpoints.tablet}) {
    padding: 0 16px;
  }

  @media (min-width: ${breakpoints.tablet}) {
    padding: 0 24px;
  }
`;

function App() {
  return (
    <>
      <Global styles={globalStyles} />
      <AppContainer>
        <ChatInterface />
      </AppContainer>
    </>
  );
}

export default App;
