import React, { useState, useRef, useEffect } from 'react';
import type { ChangeEvent, KeyboardEvent, FormEvent } from 'react';
import type { Message } from '../types/chat';
import {
  ChatContainer,
  Header,
  MessagesContainer,
  MessageBubble,
  InputContainer,
  InputWrapper,
  Input,
  EnterButton,
  LoadingBubble,
  LoadingDots,
  Dot,
  HeaderLeft,
  LogoImg,
  BrandText,
  HeaderRight,
  ShareButton,
  ShareIcon,
  OptionButton
} from '../styles/ChatStyles';

export const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const newHeight = Math.min(textarea.scrollHeight, 7 * 24); // 최대 7줄
      textarea.style.height = `${newHeight}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [inputValue]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now(),
      text: inputValue,
      isUser: true,
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // 임시 응답 시뮬레이션
    setTimeout(() => {
      const botMessage: Message = {
        id: Date.now(),
        text: '월요일은 비가 10mm 이하가 법적 기준에 맞춰 콘크리트 작업을 할 수 있습니다. 화수목은 내장 유리 창호, 벽체 작업등을 추천합니다. 해당에 맞춰 추천 공정표를 짜드리겠습니다.',
        isUser: false,
      };
      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <ChatContainer>
      <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <HeaderLeft>
          <LogoImg src="/logo.png" alt="로고" />
          <BrandText>HOBANI</BrandText>
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
            {message.text}
          </MessageBubble>
        ))}
        {isLoading && (
          <LoadingBubble>
            <LoadingDots>
              <Dot />
              <Dot />
              <Dot />
            </LoadingDots>
          </LoadingBubble>
        )}
        <div ref={messagesEndRef} />
      </MessagesContainer>
      <InputContainer onSubmit={handleSubmit}>
        <InputWrapper>
          <Input
            ref={textareaRef}
            value={inputValue}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="메시지 입력"
            disabled={isLoading}
            rows={1}
          />
          <EnterButton 
            type="submit" 
            disabled={isLoading}
            hasInput={inputValue.trim().length > 0}
          >
            전송
          </EnterButton>
        </InputWrapper>
      </InputContainer>
    </ChatContainer>
  );
}; 