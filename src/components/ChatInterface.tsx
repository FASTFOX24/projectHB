import React, { useState, useRef, useEffect } from 'react';
import type { ChangeEvent, KeyboardEvent, FormEvent } from 'react';
import type { Message as MessageBase } from '../types/chat';
import OrderModal from './OrderModal';
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
  OptionButton,
  ModalOverlay,
  ModalImage,
  BubbleImage,
  BubbleButton,
  MessageWrapper,
  ProfileImage,
  MessageContent,
  ProfileName,
} from '../styles/ChatStyles';

type Message = Omit<MessageBase, 'text'> & { text: string | React.ReactNode };

export const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImg, setModalImg] = useState<string | null>(null);
  const [lastUserQuestion, setLastUserQuestion] = useState<string | null>(null);
  const [lastUserQuestions, setLastUserQuestions] = useState<string[]>([]);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [orderSuccessModalOpen, setOrderSuccessModalOpen] = useState(false);
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
    setLastUserQuestion(inputValue.trim());
    setLastUserQuestions(prev => {
      const next = [...prev, inputValue.trim()];
      return next.length > 2 ? next.slice(-2) : next;
    });

    // 자기소개 커스텀 응답
    if (inputValue.trim() === '안녕 자기소개 해줘') {
      const botMessage: Message = {
        id: Date.now() + 1,
        text: `안녕하세요 저는 호반에서 만든 건설업계 전용 인공지능 어시스턴트, HOBANAI예요. 궁금한점이 있으면, 무엇이든 빠르고 정확하게 찾아서 알려드릴게요. 😊\n\n주요 특징을 간단히 소개하자면\n\n1. 실시간 사내 정보 제공 : 그룹웨어 공지사항, 사회공헌, 인사발령, 직원소식, 복리후생 등 회사내의 공지사항을 실시간으로 업데이트하여 알려드릴 수 있어요.\n\n2. 다양한 질문 처리 : 건설 지식과 관련된 간단한 상식부터 복잡한 전문지식까지, 어떤 질문이든 답변해드릴 수 있어요.\n\n3. 문서/이미지 요약 : 긴 글이나 문서, 이미지도 요약해드려서 빠르게 핵심만 파악할 수 있어요.\n\n앞으로 궁금한 점, 필요한 정보, 고민되는 일 등 언제든 편하게 물어봐주세요!`,
        isUser: false,
      };
      setTimeout(() => {
        setMessages(prev => [...prev, botMessage]);
        setIsLoading(false);
      }, 3000);
      return;
    }

    // 공정계획 추천 커스텀 응답
    if (inputValue.trim() === '내일부터 1주일동안 비가 내려서 콘크리트 타설을 다음주 월요일로 미뤄야 할 거 같아 공정계획 추천해줘') {
      const botMessage: Message = {
        id: Date.now() + 2,
        text: (
          <span>
            네, 오늘 6월 24일부터 기상청 날씨 데이터를 분석해 공정표를 수정하겠습니다.<br /><br />
            <BubbleImage
              src="/weather.png"
              onClick={() => { setModalImg('/weather.png'); setModalOpen(true); }}
            /><br />
            기상청의 날씨 데이터를 기반으로 분석한 결과, 차주 일주일간 기상악화로 인해 콘크리트 타설이 불가능합니다. 호반건설의 타 현장 사례들을 분석하여 최적의 공정계획을 2가지 제안드리겠습니다.
          </span>
        ),
        isUser: false,
      };
      const plan1: Message = {
        id: Date.now() + 3,
        text: (
          <span>
            방안 1<br />
            <BubbleImage
              src="/chart_1.png"
              onClick={() => { setModalImg('/chart_1.png'); setModalOpen(true); }}
            /><br />
            공정표1은 콘크리트타설을 1주일 미룬 공정표입니다.<br />
            단, 일일강수량이 1mm이하로 비교적 적은 목, 금요일은 콘크리트타설이 가능할 것 같습니다.<br /><br />
            말씀해주신다면 이를 반영해서 공정표를 다시 작성하겠습니다.
          </span>
        ),
        isUser: false,
      };
      const plan2: Message = {
        id: Date.now() + 5,
        text: (
          <span>
            방안 2<br />
            <BubbleImage
              src="/chart_2.png"
              onClick={() => { setModalImg('/chart_2.png'); setModalOpen(true); }}
            /><br />
            공정표2은 지하 동 PIT 구간 타설을 우천이 예정된 24일로 가져온 공정표입니다.<br />
            타설 선행공정이 완료되었을 때를 가정하고 작성한 공정표입니다.
          </span>
        ),
        isUser: false,
      };
      setTimeout(() => {
        setMessages(prev => [...prev, botMessage]);
        setIsLoading(false);
        setTimeout(() => {
          setMessages(prev => [...prev, plan1]);
          setTimeout(() => {
            setMessages(prev => [...prev, plan2]);
          }, 500);
        }, 500);
      }, 3000);
      return;
    }

    // 좋아 2번으로 선택할게. 이 공정표를 공유폴더의 주간, 월간, 전체 공정표에 수정해서 반영해줘
    if (inputValue.trim() === '좋아 2번으로 선택할게 이 공정표를 공유폴더의 주간, 월간, 전체 공정표에 수정해서 반영해줘') {
      if (lastUserQuestion === '내일부터 1주일동안 비가 내려서 콘크리트 타설을 다음주 월요일로 미뤄야 할 거 같아 공정계획 추천해줘') {
        const msg1: Message = {
          id: Date.now() + 10,
          text: '네, 주간 공정표와 월간 공정표, 전체 공정표를 수정하겠습니다.',
          isUser: false,
        };
        const msg2: Message = {
          id: Date.now() + 11,
          text: (
            <BubbleImage
              src="/chart_3.png"
              onClick={() => { setModalImg('/chart_3.png'); setModalOpen(true); }}
            />
          ),
          isUser: false,
        };
        const msg3: Message = {
          id: Date.now() + 12,
          text: '주간 공정표 수정 완료했습니다.',
          isUser: false,
        };
        const msg4: Message = {
          id: Date.now() + 13,
          text: (
            <BubbleImage
              src="/chart_4.png"
              onClick={() => { setModalImg('/chart_4.png'); setModalOpen(true); }}
            />
          ),
          isUser: false,
        };
        const msg5: Message = {
          id: Date.now() + 14,
          text: '월간 공정표 수정 완료했습니다.',
          isUser: false,
        };
        const msg6: Message = {
          id: Date.now() + 15,
          text: (
            <BubbleImage
              src="/chart_5.png"
              onClick={() => { setModalImg('/chart_5.png'); setModalOpen(true); }}
            />
          ),
          isUser: false,
        };
        const msg7: Message = {
          id: Date.now() + 16,
          text: '전체 공정표 수정 완료했습니다.',
          isUser: false,
        };
        setTimeout(() => {
          setMessages(prev => [...prev, msg1]);
          setIsLoading(false);
          setTimeout(() => {
            setMessages(prev => [...prev, msg2]);
            setTimeout(() => {
              setMessages(prev => [...prev, msg3]);
              setTimeout(() => {
                setMessages(prev => [...prev, msg4]);
                setTimeout(() => {
                  setMessages(prev => [...prev, msg5]);
                  setTimeout(() => {
                    setMessages(prev => [...prev, msg6]);
                    setTimeout(() => {
                      setMessages(prev => [...prev, msg7]);
                    }, 500);
                  }, 500);
                }, 500);
              }, 500);
            }, 500);
          }, 500);
        }, 3000);
        return;
      }
      // 사전 질문이 없으면 임시 응답
    }

    // 발주 및 기성관리
    if (inputValue.trim() === '오늘 주문해야 할 새로운 자재나 인력 발주사항 있어?') {
      const msg1: Message = {
        id: Date.now() + 20,
        text: `네, 확인해보겠습니다.\n남은 자재량, 현 시공팀의 평균 시공 속도와 자재소모량, 공사일보와 공정표를 바탕으로 한 남은 공정량 그리고 추후 투입될 타 공종의 영향을 바탕으로 분석했습니다. 실제 현장상황과 다를 수 있으니 유의해주시기 바랍니다.`,
        isUser: false,
      };
      const msg2: Message = {
        id: Date.now() + 21,
        text: (
          <span>
            다음주 월요일에(6월 30일) 6동부터 15동 16층부터 최상층(22F~25F)까지 조적 작업이 있습니다. 현재 남아있는 조적용 레미탈 양은 50포(40kg 단위)입니다. '플랜P 현장'의 '00건설' 작업팀 일일 평균 레미탈 시공량은 3포대고, 평균 배송기간은 일주일입니다. 따라서 금일 혹은 명일에 발주 넣는 것을 추천드립니다. 아래 링크을 누르시면 자동으로 발주 주문을 넣어드리겠습니다.<br /><br />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
              <BubbleButton
                style={{
                  background: '#f07a03',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 18,
                  padding: '8px 20px',
                  fontWeight: 500,
                  fontSize: 14,
                  cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(240,122,3,0.15)',
                  transition: 'background 0.2s, box-shadow 0.2s',
                  letterSpacing: 1,
                }}
                onMouseOver={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = '#c95e00';
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 6px 24px rgba(240,122,3,0.25)';
                }}
                onMouseOut={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = '#f07a03';
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 16px rgba(240,122,3,0.15)';
                }}
                onClick={() => setOrderModalOpen(true)}
              >
                레미탈 발주 바로 넣기
              </BubbleButton>
            </div>
          </span>
        ),
        isUser: false,
      };
      setTimeout(() => {
        setMessages(prev => [...prev, msg1]);
        setIsLoading(false);
        setTimeout(() => {
          setMessages(prev => [...prev, msg2]);
        }, 500);
      }, 3000);
      return;
    }

    // 주문한 자재가 오늘 아침에 들어왔어 스캔폴더에 있는 가장 최근 거래 명세서를 데이터화해줘
    if (inputValue.trim() === '주문한 자재가 오늘 아침에 들어왔어 스캔폴더에 있는 가장 최근 거래 명세서를 데이터화해줘') {
      const msg1: Message = {
        id: Date.now() + 30,
        text: '해당 거래명세서가 맞습니까?',
        isUser: false,
      };
      const msg2: Message = {
        id: Date.now() + 31,
        text: (
          <BubbleImage
            src="/bill.png"
            onClick={() => { setModalImg('/bill.png'); setModalOpen(true); }}
          />
        ),
        isUser: false,
      };
      setTimeout(() => {
        setMessages(prev => [...prev, msg1]);
        setIsLoading(false);
        setTimeout(() => {
          setMessages(prev => [...prev, msg2]);
        }, 500);
      }, 3000);
      return;
    }

    // 응 맞아
    if (inputValue.trim() === '응 맞아') {
      if (lastUserQuestion === '주문한 자재가 오늘 아침에 들어왔어 스캔폴더에 있는 가장 최근 거래 명세서를 데이터화해줘') {
        const botMessage: Message = {
          id: Date.now() + 40,
          text: `네 알겠습니다. AI 카메라 스캔을 통해 거래 명세서를 다음과 같이 데이터화했습니다.\n \n백관 나시부속 주물소켓 (50A) 20EA\n공구상자 (370*185*116) 20EA\n공구상사 (505*335*195) 20EA\n고압밴드 (35~50mm) 10EA\n백관 나시부속 철중니플 (50A) 20EA\n흑고압 에어호스 (19mm*50) 4EA\n사다리전도방지대 2EA\n붓싱(나사)백 (50A x 25A) 10EA`,
          isUser: false,
        };
        setTimeout(() => {
          setMessages(prev => [...prev, botMessage]);
          setIsLoading(false);
        }, 3000);
        return;
      }
      // 사전 질문이 없으면 임시 응답
    }

    if (inputValue.trim() === '위의 데이터로 자재일지 작성해줘') {
      if (
        lastUserQuestions[0] === '주문한 자재가 오늘 아침에 들어왔어 스캔폴더에 있는 가장 최근 거래 명세서를 데이터화해줘' &&
        lastUserQuestions[1] === '응 맞아'
      ) {
        const msg1: Message = {
          id: Date.now() + 50,
          text: (
            <BubbleImage
              src="/material_2.png"
              onClick={() => { setModalImg('/material_2.png'); setModalOpen(true); }}
            />
          ),
          isUser: false,
        };
        const msg2: Message = {
          id: Date.now() + 51,
          text: '공유폴더에 있는 자재일지 양식을 바탕으로 최신화했습니다.',
          isUser: false,
        };
        setTimeout(() => {
          setMessages(prev => [...prev, msg1]);
          setIsLoading(false);
          setTimeout(() => {
            setMessages(prev => [...prev, msg2]);
          }, 500);
        }, 3000);
        return;
      }
    }

    if (inputValue.trim() === '자재 일지랑 공사일보에 있는 데이터를 바탕으로 기성문서를 작성해서 기안문까지 올려줘') {
      
      if (lastUserQuestion === '위의 데이터로 자재일지 작성해줘') {
        const msg1: Message = {
          id: Date.now() + 50,
          text: '지난 1달간의 자재일지와 공사일보를 분석하여 출력인원 및 자재 발주량을 산출했습니다. 공사일보와 공정표를 분석하여 시공량을 산출했습니다. 이를 바탕으로 기성문서 및 기안문을 작성하겠습니다. 실제 현장상황과 다를 수 있으니 검토 부탁드립니다.',
          isUser: false,
        };
        const msg2: Message = {
          id: Date.now() + 51,
          text: `지난 한 달간의 데이터로 산출한 '자재일지' 총합본입니다.`,
          isUser: false,
        };
        const msg3: Message = {
          id: Date.now() + 52,
          text: (
            <BubbleImage
              src="/logbook.png"
              onClick={() => { setModalImg('/logbook.png'); setModalOpen(true); }}
            />
          ),
          isUser: false,
        };
        const msg4: Message = {
          id: Date.now() + 53,
          text: `지난 한 달간의 출력으로 산출한 '노무비 지금명세서'입니다.`,
          isUser: false,
        };
        const msg5: Message = {
          id: Date.now() + 54,
          text: (
            <BubbleImage
              src="/statement.png"
              onClick={() => { setModalImg('/statement.png'); setModalOpen(true); }}
            />
          ),
          isUser: false,
        };
        const msg6: Message = {
          id: Date.now() + 55,
          text: '기존의 기안문 양식을 바탕으로 작성한 기안문입니다.',
          isUser: false,
        };
        const msg7: Message = {
          id: Date.now() + 56,
          text: (
            <BubbleImage
              src="/statement_1.png"
              onClick={() => { setModalImg('/statement_1.png'); setModalOpen(true); }}
            />
          ),
          isUser: false,
        };
        setTimeout(() => {
          setMessages(prev => [...prev, msg1]);
          setIsLoading(false);
          setTimeout(() => {
            setMessages(prev => [...prev, msg2]);
            setTimeout(() => {
              setMessages(prev => [...prev, msg3]);
              setTimeout(() => {
                setMessages(prev => [...prev, msg4]);
                setTimeout(() => {
                  setMessages(prev => [...prev, msg5]);
                  setTimeout(() => {
                    setMessages(prev => [...prev, msg6]);
                    setTimeout(() => {
                      setMessages(prev => [...prev, msg7]);
                    }, 500);
                  }, 500);
                }, 500);
              }, 500);
            }, 500);
          }, 500);
        }, 3000);
        return;
      }
    }

    // 상수공 공사 서류처리 절차 안내
    if (inputValue.trim() === '우리 현장에 25년 4월부터 상수공 공사가 시작될 것 같아 관련해서 서류처리해야 할 게 뭐가 있을까?') {
      const botMessage: Message = {
        id: Date.now() + 100,
        text: `건설 현장 새로운 공정 도입 시 다음과 같은 절차가 필요합니다.\n\n1. 공문 발송\n2. 시공계획서, 상수공 계획도면 등 참고자료 첨부\n3. 감리단, 현장 관리자 등 결재\n4. 각종 회의자료 업데이트`,
        isUser: false,
      };
      setTimeout(() => {
        setMessages(prev => [...prev, botMessage]);
        setIsLoading(false);
      }, 3000);
      return;
    }

    // 상수공 공사 서류처리 절차 실행
    if (inputValue.trim() === '너가 말한 절차 바로 처리해줘') {
      if (lastUserQuestion === '우리 현장에 25년 4월부터 상수공 공사가 시작될 것 같아 관련해서 서류처리해야 할 게 뭐가 있을까?') {
        const msg1: Message = {
          id: Date.now() + 110,
          text: `알겠습니다. 기존 입력된 공문 양식을 바탕으로 생성하였습니다.\n\n1. '25-059 공문.hwp' 생성\n2. '상수공 시공계획서.xlsx' 출력\n3. 현장관리자 (자사 직원 13명) 결재요청\n4. 25년 04월 이후 '주간공정회의 자료', '발주처 회의 자료', '협력업체 회의 자료' 업데이트`,
          isUser: false,
        };
        const msg2: Message = {
          id: Date.now() + 111,
          text: (
            <BubbleImage
              src="/officialform.png"
              onClick={() => { setModalImg('/officialform.png'); setModalOpen(true); }}
            />
          ),
          isUser: false,
        };
        const msg3: Message = {
          id: Date.now() + 112,
          text: '입력되어 있던 공문 양식을 바탕으로 생성하였습니다.',
          isUser: false,
        };
        setTimeout(() => {
          setMessages(prev => [...prev, msg1]);
          setIsLoading(false);
          setTimeout(() => {
            setMessages(prev => [...prev, msg2]);
            setTimeout(() => {
              setMessages(prev => [...prev, msg3]);
            }, 500);
          }, 500);
        }, 3000);
        return;
      }
    }

    // AI 검측요청서 활용 방법 안내
    if (inputValue.trim() === 'AI를 검측요청서에 어떻게 적용할 수 있을까?') {
      const msg1: Message = {
        id: Date.now() + 120,
        text: `검측요청서에 다음과 같이 활용될 수 있습니다:\n\n1. 자동 문서 작성: 공정명, 일자 등만 입력하면 자동으로 요청서 작성\n2. 이전 요청서 불러오기: 유사 공정의 과거 문서를 참고\n3. 검사항목 자동 생성: 공정별 체크리스트 자동 삽입\n4. 사진/도면 자동 첨부: 검측 사진을 위치, 시간데이터 기반으로 자동으로 첨부\n\n이러한 도움을 줄 수 있어요.`,
        isUser: false,
      };
      const msg2: Message = {
        id: Date.now() + 121,
        text: (
          <BubbleImage
            src="/automation.png"
            onClick={() => { setModalImg('/automation.png'); setModalOpen(true); }}
          />
        ),
        isUser: false,
      };
      setTimeout(() => {
        setMessages(prev => [...prev, msg1]);
        setIsLoading(false);
        setTimeout(() => {
          setMessages(prev => [...prev, msg2]);
        }, 500);
      }, 3000);
      return;
    }

    // 임시 응답 시뮬레이션
    setTimeout(() => {
      const botMessage: Message = {
        id: Date.now(),
        text: `안녕하세요 저는 호반에서 만든 건설업계 전용 인공지능 어시스턴트, HOBANAI예요. 궁금한점이 있으면, 무엇이든 빠르고 정확하게 찾아서 알려드릴게요. 😊\n\n주요 특징을 간단히 소개하자면\n\n1. 실시간 사내 정보 제공 : 그룹웨어 공지사항, 사회공헌, 인사발령, 직원소식, 복리후생 등 회사내의 공지사항을 실시간으로 업데이트하여 알려드릴 수 있어요.\n\n2. 다양한 질문 처리 : 건설 지식과 관련된 간단한 상식부터 복잡한 전문지식까지, 어떤 질문이든 답변해드릴 수 있어요.\n\n3. 문서/이미지 요약 : 긴 글이나 문서, 이미지도 요약해드려서 빠르게 핵심만 파악할 수 있어요.\n\n앞으로 궁금한 점, 필요한 정보, 고민되는 일 등 언제든 편하게 물어봐주세요!`,
        isUser: false,
      };
      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
    }, 3000);
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
          <MessageWrapper key={message.id} isUser={message.isUser}>
            <ProfileImage 
              src={message.isUser ? '/honi.jpeg' : '/bani.jpeg'} 
              alt={message.isUser ? '호니' : '바니'} 
            />
            <MessageContent>
              <ProfileName isUser={message.isUser}>{message.isUser ? '호니' : '바니'}</ProfileName>
              <MessageBubble isUser={message.isUser}>
                {typeof message.text === 'string'
                  ? message.text.split('\n').map((line, idx) => (
                      <React.Fragment key={idx}>
                        {line}
                        <br />
                      </React.Fragment>
                    ))
                  : message.text}
              </MessageBubble>
            </MessageContent>
          </MessageWrapper>
        ))}
        {isLoading && (
          <MessageWrapper isUser={false}>
            <ProfileImage src="/bani.jpeg" alt="바니" />
            <MessageContent>
              <ProfileName isUser={false}>바니</ProfileName>
              <LoadingBubble>
                <LoadingDots>
                  <Dot />
                  <Dot />
                  <Dot />
                </LoadingDots>
              </LoadingBubble>
            </MessageContent>
          </MessageWrapper>
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
      {modalOpen && (
        <ModalOverlay onClick={() => setModalOpen(false)}>
          <ModalImage
            src={modalImg ?? ''}
            alt="확대 이미지"
            onClick={e => e.stopPropagation()}
          />
        </ModalOverlay>
      )}
      <OrderModal
        isOpen={orderModalOpen}
        onClose={() => setOrderModalOpen(false)}
        onConfirm={() => {
          setOrderModalOpen(false);
          setOrderSuccessModalOpen(true);
        }}
        type="confirm"
      />
      <OrderModal
        isOpen={orderSuccessModalOpen}
        onClose={() => setOrderSuccessModalOpen(false)}
        onConfirm={() => setOrderSuccessModalOpen(false)}
        type="success"
      />
    </ChatContainer>
  );
}; 