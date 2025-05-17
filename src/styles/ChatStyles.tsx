import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import type { StyledProps } from '../types/chat';

// 반응형 디자인을 위한 브레이크포인트
export const breakpoints = {
  mobile: '360px',
  tablet: '768px',
};

// 애니메이션
export const bounce = keyframes`
  0%, 100% { transform: scale(0); }
  50% { transform: scale(1); }
`;

// 컨테이너 스타일
export const ChatContainer = styled.div`
  width: 100%;
  max-width: 800px;
  height: 100vh;
  height: 100dvh;
  display: flex;
  flex-direction: column;
  background-color: #1a1a1a;
  position: relative;

  @media (max-width: ${breakpoints.mobile}) {
    height: -webkit-fill-available;
    min-height: 100dvh;
  }
`;

export const Header = styled.div`
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #2a2a2a;

  @media (max-width: ${breakpoints.mobile}) {
    padding: 12px;
  }
`;

export const BotProfile = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #f07a03;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 14px;
`;

// 메시지 영역 스타일
export const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  scrollbar-width: thin;
  scrollbar-color: transparent transparent;
  transition: scrollbar-color 0.3s ease;
  min-height: 0;
  padding-bottom: env(safe-area-inset-bottom);

  &:hover,
  &:focus,
  &:active {
    scrollbar-color: #666 transparent;
  }

  @media (max-width: ${breakpoints.mobile}) {
    padding: 12px;
    gap: 12px;
  }

  /* Chrome, Safari, Edge 용 스크롤바 스타일 */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: transparent;
    border-radius: 3px;
    transition: background-color 0.3s ease;
  }

  &:hover,
  &:focus,
  &:active {
    &::-webkit-scrollbar-thumb {
      background: #666;
    }
  }
`;

export const MessageBubble = styled.div<StyledProps>`
  max-width: 70%;
  padding: 12px 16px;
  margin: 4px 0;
  border-radius: 18px;
  background-color: ${(props: StyledProps) => props.isUser ? '#f07a03' : '#2a2a2a'};
  color: #ffffff;
  align-self: ${(props: StyledProps) => props.isUser ? 'flex-end' : 'flex-start'};
  word-wrap: break-word;
  font-size: 15px;
  line-height: 1.5;
  position: relative;

  @media (max-width: ${breakpoints.mobile}) {
    max-width: 85%;
    padding: 10px 14px;
    font-size: 14px;
  }

  ${(props: StyledProps) => props.isUser ? `
    border-bottom-right-radius: 4px;
  ` : `
    border-bottom-left-radius: 4px;
  `}

  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    width: 12px;
    height: 12px;
    background-color: ${(props: StyledProps) => props.isUser ? '#f07a03' : '#2a2a2a'};
    ${(props: StyledProps) => props.isUser ? 'right: -6px;' : 'left: -6px;'}
    clip-path: ${(props: StyledProps) => 
      props.isUser 
        ? 'polygon(0 0, 0% 100%, 100% 100%)'
        : 'polygon(0 100%, 100% 100%, 100% 0)'
    };

    @media (max-width: ${breakpoints.mobile}) {
      width: 10px;
      height: 10px;
      ${(props: StyledProps) => props.isUser ? 'right: -5px;' : 'left: -5px;'}
    }
  }
`;

// 입력 영역 스타일
export const InputContainer = styled.form`
  display: flex;
  padding: 16px;
  background-color: #1a1a1a;
  border-top: 1px solid #2a2a2a;
  position: sticky;
  bottom: 0;
  width: 100%;
  margin-top: auto;

  @media (max-width: ${breakpoints.mobile}) {
    padding: 12px;
    padding-bottom: env(safe-area-inset-bottom, 12px);
  }
`;

export const InputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

export const Input = styled.textarea`
  width: 100%;
  padding: 12px;
  padding-right: 48px;
  background-color: #2a2a2a;
  border: none;
  border-radius: 8px;
  color: #ffffff;
  font-size: 15px;
  resize: none;
  min-height: 44px;
  max-height: calc(1.5em * 7 + 24px);
  line-height: 1.5;
  overflow-y: auto;
  scrollbar-width: none; /* Firefox */
  
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Edge */
  }
  
  &::placeholder {
    color: #666;
  }
  
  &:focus {
    outline: none;
  }

  @media (max-width: ${breakpoints.mobile}) {
    padding-right: 40px;
    font-size: 14px;
  }
`;

export const EnterButton = styled.button<{ hasInput: boolean }>`
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: ${props => props.hasInput ? '#f07a03' : '#666'};
  padding: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  
  &:hover {
    color: #f07a03;
  }

  &:disabled {
    color: #444;
    cursor: not-allowed;
  }

  @media (max-width: ${breakpoints.mobile}) {
    right: 6px;
  }
`;

// 로딩 관련 스타일
export const LoadingBubble = styled.div`
  max-width: 70%;
  padding: 12px;
  margin: 4px 0;
  border-radius: 18px;
  background-color: #2a2a2a;
  align-self: flex-start;
  position: relative;
  border-bottom-left-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 60px;
  height: 40px;

  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    width: 12px;
    height: 12px;
    background-color: #2a2a2a;
    left: -6px;
    clip-path: polygon(0 100%, 100% 100%, 100% 0);
  }
`;

export const LoadingDots = styled.div`
  display: flex;
  gap: 4px;
`;

export const Dot = styled.div`
  width: 8px;
  height: 8px;
  background-color: #666;
  border-radius: 50%;
  animation: ${bounce} 1s infinite;

  &:nth-of-type(1) {
    animation-delay: 0s;
  }

  &:nth-of-type(2) {
    animation-delay: 0.2s;
  }

  &:nth-of-type(3) {
    animation-delay: 0.4s;
  }
`; 