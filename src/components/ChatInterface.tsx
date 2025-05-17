import React, { useState, useRef, useEffect } from 'react';
import type { ChangeEvent, KeyboardEvent, FormEvent } from 'react';
import type { Message } from '../types/chat';
import {
  ChatContainer,
  Header,
  BotProfile,
  MessagesContainer,
  MessageBubble,
  InputContainer,
  InputWrapper,
  Input,
  EnterButton,
  LoadingBubble,
  LoadingDots,
  Dot
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
        text: '안녕하세요! 무엇을 도와드릴까요?',
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
      <Header>
        <BotProfile>HB</BotProfile>
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
          <EnterButton type="submit" disabled={isLoading}>
            전송
          </EnterButton>
        </InputWrapper>
      </InputContainer>
    </ChatContainer>
  );
}; 