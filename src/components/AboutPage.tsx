import React, { useState, useRef, useEffect } from 'react';
import type { ChangeEvent, KeyboardEvent } from 'react';
import {
  ChatContainer,
  Header,
  HeaderLeft,
  LogoImg,
  BrandText,
  HeaderRight,
  ShareButton,
  ShareIcon,
  OptionButton,
  MessagesContainer,
  InputContainer,
  InputWrapper,
  Input,
  EnterButton,
  MessageBubble,
  AboutButton,
  AboutButtonGroup
} from '../styles/ChatStyles';

interface Message {
  id: number;
  text: string | React.ReactNode;
  isUser: boolean;
}

const WELCOME_MESSAGE = `안녕하세요. 플랜P 고객님!
호반건설 인공지능 어시스턴트 HOBANAI에요.
무엇을 도와드릴까요?`;

const ACTION_BUTTONS = [
  '호반그룹 알아보기',
  '시세정보 알아보기',
  '발표 외 AI 활용 아이디어 알아보기',
  '오늘의 식단 알아보기',
  '플랜P 프로젝트 알아보기',
];

const AboutPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: Date.now(),
      text: WELCOME_MESSAGE,
      isUser: false,
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isComposing, setIsComposing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const newHeight = Math.min(textarea.scrollHeight, 7 * 24);
      textarea.style.height = `${newHeight}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [inputValue]);

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  const handleCompositionStart = () => {
    setIsComposing(true);
  };

  const handleCompositionEnd = () => {
    setIsComposing(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !isComposing) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (!inputValue.trim() || isComposing) return;

    const userMessage: Message = {
      id: Date.now(),
      text: inputValue,
      isUser: true,
    };

    const botMessage: Message = {
      id: Date.now() + 1,
      text: (
        <>
          {WELCOME_MESSAGE.split('\n').map((line, idx) => (
            <React.Fragment key={idx}>
              {line}
              <br />
            </React.Fragment>
          ))}
          <AboutButtonGroup>
            {ACTION_BUTTONS.map((text, idx) => (
              <AboutButton key={idx}>{text}</AboutButton>
            ))}
          </AboutButtonGroup>
        </>
      ),
      isUser: false,
    };

    setMessages(prev => [...prev, userMessage, botMessage]);
    setInputValue('');
  };

  return (
    <ChatContainer>
      <Header>
        <HeaderLeft>
          <LogoImg src="/logo.png" alt="로고" />
          <BrandText>HOBANAI</BrandText>
        </HeaderLeft>
        <HeaderRight>
          <ShareButton title="공유하기">
            <ShareIcon viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="15" cy="5" r="2" stroke="#575553" strokeWidth="1.5"/>
              <circle cx="5" cy="10" r="2" stroke="#575553" strokeWidth="1.5"/>
              <circle cx="15" cy="15" r="2" stroke="#575553" strokeWidth="1.5"/>
              <path d="M7 10.5L13 14" stroke="#575553" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M7 9.5L13 6" stroke="#575553" strokeWidth="1.5" strokeLinecap="round"/>
            </ShareIcon>
          </ShareButton>
          <OptionButton title="옵션">⋮</OptionButton>
        </HeaderRight>
      </Header>
      <MessagesContainer>
        {messages.map((message) => (
          <MessageBubble key={message.id} isUser={message.isUser}>
            {typeof message.text === 'string'
              ? message.text.split('\n').map((line, idx) => (
                  <React.Fragment key={idx}>
                    {line}
                    <br />
                  </React.Fragment>
                ))
              : message.text}
            {!message.isUser && message.id === messages[0].id && (
              <AboutButtonGroup>
                {ACTION_BUTTONS.map((text, idx) => (
                  <AboutButton key={idx}>{text}</AboutButton>
                ))}
              </AboutButtonGroup>
            )}
          </MessageBubble>
        ))}
        <div ref={messagesEndRef} />
      </MessagesContainer>
      <InputContainer>
        <InputWrapper>
          <Input
            ref={textareaRef}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
            placeholder="메시지 입력"
            rows={1}
          />
          <EnterButton 
            onClick={handleSubmit}
            disabled={!inputValue.trim() || isComposing}
            hasInput={inputValue.trim().length > 0}
          >
            전송
          </EnterButton>
        </InputWrapper>
      </InputContainer>
    </ChatContainer>
  );
};

export default AboutPage; 