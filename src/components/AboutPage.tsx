import React, { useState, useRef, useEffect } from 'react';
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
  MessageBubble,
  AboutButton,
  AboutButtonGroup,
  ResponseImage,
  ModalOverlay,
  ModalImage,
  MessageWrapper,
  ProfileImage,
  MessageContent,
  ProfileName,
} from '../styles/ChatStyles';

interface Message {
  id: number;
  text: string | React.ReactNode;
  isUser: boolean;
  type?: string;
}

const WELCOME_MESSAGE = `안녕하세요. 플랜P 고객님!
호반건설 인공지능 어시스턴트 HOBANAI에요. 😊
무엇을 도와드릴까요?`;

const ACTION_BUTTONS = [
  '질문 시작하기'
];

const MAIN_BUTTONS = [
  '출력일보 작성하기',
  '발표 외 AI 활용 아이디어 알아보기',
  '호반그룹 알아보기',
  '시세정보 알아보기',
  '오늘의 식단 알아보기',
  '플랜P 팀원 알아보기'
];

const MARKET_INFO_BUTTONS = ['환율', '자재시세'];

const EXCHANGE_RATE_TEXT = `금일 환율 현황을 알려드리겠습니다.오늘의 환율은 전체적으로 내려갔습니다.오늘(2025년 5월 19일) 원/달러 환율이 하락한 주요 원인은 다음과 같습니다.\n\n· 미국의 상호관세 유예 발표: 도널드 트럼프 미국 대통령이 상호관세 부과 계획을 유예하겠다고 발표하면서, 시장의 불확실성이 줄어들고 위험자산 선호 심리가 회복되었습니다. 이는 달러 약세로 이어져 원화 가치 상승에 영향을 미쳤습니다. 출처)Nate 뉴스+5지식iN+5MBC NEWS+5\n\n· 외국인의 국내 증시 순매수 증가: 외국인 투자자들이 국내 유가증권시장에서 약 3,286억 원을 순매수하면서, 원화 수요가 증가하여 환율 하락 요인으로 작용했습니다. 출처)MBC NEWS+1경향신문+1\n\n· 달러 약세 전환: 미국의 관세 정책 변화 가능성과 경제 지표 부진 등으로 인해 달러 가치가 하락하였습니다. 이는 원/달러 환율 하락에 직접적인 영향을 주었습니다. 출처)한국무역협회+3지식iN+3경향신문+3`;

const MATERIAL_PRICE_TEXT = `금일 자재 현황을 알려드리겠습니다.\n\n· 국내 건설 경기 회복: 국내 건설 경기가 회복되면서 철강 등 건설 자재에 대한 수요가 증가하였습니다. 특히, 하반기로 갈수록 철강 수요는 더욱 증가할 전망입니다. 출처)한국건설산업연구원\n\n· 노동 비용 증가: 2025년 7월부터 주 52시간 근무제가 5인 이상 사업장에 적용되면서, 건설 현장의 인건비가 상승하였습니다. 이는 건설 자재의 생산 및 공급 비용 증가로 이어졌습니다. 출처)한국건설산업연구원\n\n· 글로벌 공급망 불안: 국제 원자재 시장의 변동성과 글로벌 공급망의 불안정성이 건설 자재 가격 상승에 영향을 미쳤습니다. 특히, 주요 원자재의 수급 불균형이 가격 상승을 촉진하였습니다.`;

const HOBAN_GROUP_BUTTONS = [
  '호반의 역사',
  '경영특징과 사회공헌',
  '계열사',
  '호반그룹 캐릭터',
];

const HOBAN_GROUP_RESPONSE = `호반그룹에 대해 어떤 것을 알고 싶으신가요?`;

const HOBAN_HISTORY = `호반그룹은 1989년 7월, 창업주 김상열 회장이 광주에서 자본금 1억 원으로 설립한 건설회사인 호반건설에서 출발했습니다. 설립 초기부터 건설업과 부동산 개발 사업을 동시에 전개하며, 광주 및 호남 지역을 중심으로 주택 도급사업을 통해 빠르게 성장했습니다.\n\n· 1990년대: 광주 지역에서 건설사업을 본격적으로 시작했고, 1999년에는 '꿈을 현실로 장학회'(현 호반장학재단)를 설립해 사회공헌 활동도 병행했습니다\n\n· 2000년대: '호반리젠시빌', '호반베르디움' 등 주택 브랜드를 선보이며 민간임대아파트 공급을 통해 사업을 확장했습니다. 2005년 본사를 광주에서 서울 강남으로 이전하며 전국구 기업으로 도약했습니다\n\n· 2008년 글로벌 금융위기에도 분양률 90% 미만 사업은 진행하지 않고, 어음 없이 현금 결제를 고수하는 안정적 경영 기조로 위기를 기회로 삼아 성장세를 유지했습니다. 2009년에는 전국 주택 공급 실적 1위를 기록하며 다수의 신도시 및 택지지구 개발에 참여했습니다\n\n· 2010년대: 2011년 KBC광주방송 인수, 2017년 울트라건설(현 호반산업)과 유원TBM(현 호반TBM) 인수 등으로 사업 다각화와 외형 성장을 꾀했습니다. 2019년에는 서울신문 주식 인수로 3대 주주에 오르며 미디어 분야로도 진출했습니다\n\n· 2020년대: 2021년 대한전선 인수, 한진칼 지분 취득 등 비건설 분야로도 사업을 확장하며 자산총액 13조 원이 넘는 대기업 집단으로 성장, 2024년 기준 재계 순위 34위에 올랐습니다`;

const HOBAN_MANAGEMENT = `보수적이고 안정적인 재무운영
· 단 한 장의 어음도 쓰지 않는 기업'이라는 슬로건 아래 무차입 경영, 현금 결제 원칙을 고수합니다. 분양률이 90% 미만인 사업은 진행하지 않는 등 보수적이고 안정적인 경영 기조를 유지해왔습니다.
· 부채비율이 2020년 기준 54%로, 동종 업계 대비 매우 낮은 수준을 보입니다. 이는 재무 건전성에 대한 강한 신념과 장기적 안목의 투자 전략에서 비롯된 결과입니다.

윤리경영과 ESG
· 호반그룹은 윤리경영과 ESG(환경·사회·지배구조) 경영을 강조하며, 건전한 조직문화와 고객가치 창출을 위해 노력하고 있습니다.
· 내부적으로 임직원 복지와 윤리의식 강화, 외부적으로는 사회적 책임을 다하는 기업문화를 추구합니다.

임직원 복지 및 가족친화 정책
· 결혼, 임신, 출산, 육아 등 생애주기별로 다양한 복지 혜택을 제공하는 '아이좋은 호반생활' 제도를 시행하고 있습니다. 결혼 축하금, 난임 시술비 지원, 태교 여행 패키지 등 임직원의 삶의 질 향상과 일·가정 양립을 위한 다양한 제도를 마련하고 있습니다.

사회공헌
호반장학재단 및 인재양성
· 1999년 창업주가 개인 재산을 출연해 설립한 '호반장학재단'은 24년간 8,700여 명에게 154억 원의 장학금을 지원했습니다. 지역 인재 양성, 국가 공무원 자녀, 교육 불평등 해소 등 다양한 장학 프로그램을 운영하고 있습니다.

지역사회 및 취약계층 지원
· 교육, 지역사회, 취약계층, 문화예술, 재난구호 등 다양한 분야에서 사회공헌 활동을 활발히 전개하고 있습니다. 국내외 자연재해 피해 복구 성금, 의료 연구 인프라 지원, 군부대 지원, 환아 의료비 지원 등 폭넓은 기부와 후원을 이어가고 있습니다.
· 예를 들어, 2023년 영남권 산불피해 구호 성금 3억 원, 튀르키예 지진 및 우크라이나 전쟁 피해 복구 지원금 12억 원, 의료계 누적 기부금 21억 원 등이 대표적입니다.

임직원 참여형 봉사단 '호반사랑나눔이'
· 2009년부터 임직원 봉사단 '호반사랑나눔이'를 운영하며, 전 임직원이 지역사회와 어려운 이웃을 위해 꾸준히 봉사활동에 참여하고 있습니다. 협동심과 배려심을 기르고, 성숙한 기업시민으로서의 역할을 실천하는 데 중점을 두고 있습니다.

지속가능경영과 사회적 책임
· 호반그룹은 "신뢰를 바탕으로 사회 각 분야에 기여하는 든든한 동반자"라는 비전 아래, 사회적 책임을 넘어 지역사회와의 지속 가능한 성장에 방점을 두고 있습니다.`;

const HOBAN_SUBSIDIARIES = `호반그룹 주요 계열사 소개
호반그룹은 건설을 중심으로 다양한 분야에 진출한 대기업으로, 2024년 기준 자산총액 13조~16조 원, 계열사 수 30개 이상을 보유하고 있습니다. 주요 계열사는 아래와 같습니다.\n
건설·개발
· ㈜호반건설: 그룹의 모태이자 주력 건설사.
· ㈜호반산업: 토목·건축 시공 및 개발 사업.
· 호반프라퍼티㈜: 부동산 개발 및 시행.
· ㈜호반티비엠: TBM(터널굴착기) 등 건설기계 분야.\n
제조·에너지
· 대한전선: 전선 제조 및 에너지 솔루션.
· ㈜삼성금거래소: 귀금속 및 금 유통.\n
레저·여가
· ㈜호반호텔앤리조트(리솜리조트): 리조트 및 호텔 운영.
· 에이치원클럽㈜(H1 CLUB): 프라이빗 멤버십 골프장 등.
· 호반서서울㈜(서서울컨트리클럽): 골프장 운영.\n
유통·미디어
· 서울신문: 일간지 및 미디어 사업.
· ㈜EBN: 온라인 미디어.
· 대아청과㈜: 농산물 유통.\n
투자·금융
· 코너스톤투자파트너스㈜: 벤처투자 및 자산운용.
· 플랜에이치벤처스㈜: 스타트업 투자.\n
기타
· 아브뉴프랑: 상업시설 및 임대형 스트리트몰 운영.
· 공익법인: 호반문화재단, 호반장학재단 등.\n
호반그룹은 건설, 제조, 리조트, 골프, 유통, 미디어, 금융 등 다양한 사업군을 아우르며, 각 분야별로 특화된 계열사를 통해 사업을 확장하고 있습니다.`;

const AI_IDEA_BUTTONS = ['시공지침', '공사일보 자동 작성', '도면 비교 분석'];
const GUIDE_DETAIL_BUTTONS = ['건축', '토목,조경', '설비,소방', 'TBM(기계)'];
const GUIDE_DETAIL_TEXT = `매번 업데이트 되는 시공지침의 가장 최신 버전을 손쉽게 검색하고 찾아볼 수 있는 기능입니다. 챗봇형식으로 궁금한 시공지침에 대해 물어보고 HOBANAI가 가장 최신 버전의 지침을 알려주는 기능으로 복잡한 문서 탐색 없이 신속하게 필요한 정보를 제공받을 수 있습니다. 이를 통해 업무효율성과 정확성을 획기적으로 향상시킬 수 있습니다.\n
(예시를 보고 싶으면 아래 버튼을 클릭하시오)`;

const ConfirmModal = ({ isOpen, onClose, onConfirm }: { isOpen: boolean; onClose: () => void; onConfirm: () => void }) => {
  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <div 
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
          zIndex: 1000,
          minWidth: '300px',
          textAlign: 'center',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ marginBottom: '20px', fontSize: '16px', color: 'black' }}>
          출력일보를 작성하시겠습니까?
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
          <AboutButton 
            onClick={onConfirm}
            style={{ backgroundColor: '#f07a03', color: 'white' }}
          >
            예
          </AboutButton>
          <AboutButton 
            onClick={onClose}
            style={{ backgroundColor: '#e0e0e0' }}
          >
            아니요
          </AboutButton>
        </div>
      </div>
    </ModalOverlay>
  );
};

export const AboutPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: Date.now(),
      text: (
        <>
          HOBANAI 챗봇에 오신 것을 환영합니다.
          <AboutButtonGroup>
            {ACTION_BUTTONS.map((text, idx) => (
              <AboutButton key={idx} onClick={() => handleButtonClick(text)}>
                {text}
              </AboutButton>
            ))}
          </AboutButtonGroup>
        </>
      ),
      isUser: false,
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [modalImage, setModalImage] = useState<string | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const handleRestart = () => {
    setMessages(prev => [
      ...prev,
      {
        id: Date.now(),
        type: 'welcomeMessage',
        text: (
          <>
            {WELCOME_MESSAGE.split('\n').map((line, idx) => (
              <React.Fragment key={idx}>
                {line}
                <br />
              </React.Fragment>
            ))}
            <AboutButtonGroup>
              {MAIN_BUTTONS.map((text, idx) => (
                <AboutButton
                  key={idx}
                  onClick={() => handleButtonClick(text)}
                  style={text === '출력일보 작성하기' ? { backgroundColor: '#E0FFFF' } : {}}
                >
                  {text}
                </AboutButton>
              ))}
            </AboutButtonGroup>
          </>
        ),
        isUser: false,
      }
    ]);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleImageClick = (src: string) => {
    setModalImage(src);
  };

  const handleCloseModal = () => {
    setModalImage(null);
  };

  const handleConfirmModal = () => {
    window.location.href = 'https://m.site.naver.com/1Jswn';
  };

  const handleButtonClick = (text: string) => {
    if (text === "출력일보 작성하기") {
      setIsConfirmModalOpen(true);
      return;
    }

    const userMessage: Message = {
      id: Date.now(),
      text: text === '건축' ? '조적공종이 다음 주 월요일에 들어오는데 내가 알아두고 확인할 사항들을 정리해줘' : text === '토목,조경' ? '흙막이 공사에 대해 설명해줘' : text === '설비,소방' ? '저수조 설치기준 설명해줘' : text === 'TBM(기계)' ? 'TBM 및 터널 내 운반, 보급, 취급 지침에 대해 설명해줘': text === '오늘의 식단 알아보기' ? '오늘 점심 뭐야?' : text,
      isUser: true,
    };

    const botResponse: Message = {
      id: Date.now() + 1,
      text: getResponse(text),
      isUser: false,
    };

    setMessages(prev => [...prev, userMessage, botResponse]);
  };

  const getResponse = (text: string): React.ReactNode => {
    if (text === '질문 시작하기') {
      return (
        <>
          {WELCOME_MESSAGE.split('\n').map((line, idx) => (
            <React.Fragment key={idx}>
              {line}
              <br />
            </React.Fragment>
          ))}
          <AboutButtonGroup>
            {MAIN_BUTTONS.map((text, idx) => (
              <AboutButton
                key={idx}
                onClick={() => handleButtonClick(text)}
                style={text === '출력일보 작성하기' ? { backgroundColor: 'rgb(176,224,230)' } : {}}
              >
                {text}
              </AboutButton>
            ))}
          </AboutButtonGroup>
        </>
      );
    } else if (text === '호반그룹 알아보기') {
      return (
        <>
          {HOBAN_GROUP_RESPONSE}
          <AboutButtonGroup>
            {HOBAN_GROUP_BUTTONS.map((text, idx) => (
              <AboutButton key={idx} onClick={() => handleButtonClick(text)}>
                {text}
              </AboutButton>
            ))}
          </AboutButtonGroup>
        </>
      );
    } else if (text === '시세정보 알아보기') {
      return (
        <>
          시세정보에 대해 어떤 것을 알고 싶으신가요?
          <AboutButtonGroup>
            {MARKET_INFO_BUTTONS.map((text, idx) => (
              <AboutButton key={idx} onClick={() => handleButtonClick(text)}>
                {text}
              </AboutButton>
            ))}
          </AboutButtonGroup>
        </>
      );
    } else if (text === '환율') {
      return (
        <>
          <ResponseImage
            src="/exchangeRate.png"
            alt="환율 현황"
            style={{ maxWidth: '100%', marginBottom: '12px' }}
            onClick={() => handleImageClick('/exchangeRate.png')}
          />
          {EXCHANGE_RATE_TEXT.split('\n').map((line, idx) => (
            <React.Fragment key={idx}>
              {line}
              <br />
            </React.Fragment>
          ))}
        </>
      );
    } else if (text === '자재시세') {
      return (
        <>
          <ResponseImage
            src="/materialPrice.png"
            alt="자재시세 현황"
            style={{ maxWidth: '100%', marginBottom: '12px' }}
            onClick={() => handleImageClick('/materialPrice.png')}
          />
          {MATERIAL_PRICE_TEXT.split('\n').map((line, idx) => (
            <React.Fragment key={idx}>
              {line}
              <br />
            </React.Fragment>
          ))}
        </>
      );
    } else if (text === '호반의 역사') {
      return HOBAN_HISTORY;
    } else if (text === '경영특징과 사회공헌') {
      return HOBAN_MANAGEMENT;
    } else if (text === '계열사') {
      return HOBAN_SUBSIDIARIES;
    } else if (text === '호반그룹 캐릭터') {
      return (
        <>
          <div style={{ marginBottom: '12px' }}>
            귀염둥이 주니어 멘티 호니 & 든든한 시니어 멘토 바니!
            <br /><br />
            호반그룹이 소중히 생각하는 "함께 소통하며 성장하는 문화"를 강조하고 "친근하면서 밝은 그룹의 이미지"를 전달합니다.
          </div>
          <div style={{ 
            display: 'flex', 
            gap: '8px', 
            marginTop: '10px',
            flexWrap: 'wrap',
            justifyContent: 'flex-start'
          }}>
            <ResponseImage 
              src="/character_1.png" 
              alt="호반 캐릭터 1" 
              style={{ maxWidth: 'calc(33.33% - 6px)' }}
              onClick={() => handleImageClick('/character_1.png')}
            />
            <ResponseImage 
              src="/character_2.png" 
              alt="호반 캐릭터 2" 
              style={{ maxWidth: 'calc(33.33% - 6px)' }}
              onClick={() => handleImageClick('/character_2.png')}
            />
            <ResponseImage 
              src="/character_3.png" 
              alt="호반 캐릭터 3" 
              style={{ maxWidth: 'calc(33.33% - 6px)' }}
              onClick={() => handleImageClick('/character_3.png')}
            />
          </div>
        </>
      );
    } else if (text === '발표 외 AI 활용 아이디어 알아보기') {
      return (
        <>
          발표 외 AI 활용 아이디어에 대해 어떤 것을 알고 싶으신가요?
          <AboutButtonGroup>
            {AI_IDEA_BUTTONS.map((text, idx) => (
              <AboutButton key={idx} onClick={() => handleButtonClick(text)}>
                {text}
              </AboutButton>
            ))}
          </AboutButtonGroup>
        </>
      );
    } else if (text === '건축') {
      return (
        <>
          다음과 같은 사항을 확인해야 합니다.<br/><br/>
1. 선행공종 작업확인<br/>
· 문틀시공 및 바닥 먹매김 상태를 확인한다.<br/>
· 설비배관, 전선관, 기타 매입물 등의 시공상태를 확인<br/>
· AD/PD 내부면의 Flat Tie 등의 제거 여부 및 바닥 개구부 Open 상태를 확인한다.<br/>
· 설비배관류 보온재 시공 유무, 외벽 단열재 적정시공 여부를 확인한다.<br/><br/>
2. 자재운반 및 앵커철물 설치<br/>
· 동별, 세대별 투입 예상 물량 확인후 운반하고, 잔여 자재는 즉시 반출 또는 상부층으로 운반하여 사용한다.
· 앵커철물 설치기준(층고 2,830 ㎜ 기준) ① 바닥먹 위치 확인후 수직먹을 정밀 시공한다. ② 욕 실 : 4 단째를 시작으로 5 단(@330 ㎜)마다 총 7 개 시공 ③ 욕실 외 : 4 단째를 시작으로 9 단(@600 ㎜)마다 총 4 개 시공<br/><br/>
 자세한 사항은 아래 건축기술지침 [HGE-H5-002]을 참고해주시기 바랍니다.<br /><br />
 아래 링크를 누르시면 가장 최근 시공지침을 볼 수 있습니다.<br />
 <a href='https://drive.google.com/file/d/1kNoU9waM5f6bN0vQMhSgi9MHlOsX9Z8L/view?usp=drive_link'>시공지침 보기</a>
          <ResponseImage src="/guidebook_3.png" alt="가이드북" style={{ maxWidth: '100%', marginTop: '12px' }} onClick={() => handleImageClick('/guidebook_3.png')} />
        </>
      );
    } else if (text === '토목,조경') {
      return (
        <>
          흙막이 공사 일반사항은 다음과 같습니다. <br/><br/>
1. 흙막이 공법의 결정 및 설계와 계산은 설계도서, 지반조사보고서의 결과와 지중 매설물, 장애물의 조사서 및 주변 여건을 고려하여 지반공학 전문가의 자문을 받아 결정한다.<br/><br/>
2. 현장조건이 변화되어 흙막이 공법 또는 설계를 변경할 필요가 발생했을 경우 설계사와 협의 후, 적법한 절차를 통해서 변경승인 후 시행한다.<br/><br/>
3. 터파기 착수 전에 흙막이 계획서를 감리단에 제출 후 승인을 받아야 한다.<br/><br/>
4. 흙막이 설치 및 존치기간 중에는 안정상 필요한 계측과 점검을 하고 이상이 발견되었을 때에는 신속히 보강하거나 기타 필요한 조치를 한다.<br/><br/>
 추가 사항은 아래 호반건설 사내 건축시공지침 [HGE-H5-001]을 참고해주시기 바랍니다.<br/><br/>
 아래 링크를 누르시면 가장 최근 시공지침을 볼 수 있습니다.<br/>
 <a href="https://drive.google.com/file/d/1RWuzFk_4_EI78PNmkj57CDoyyQr_uayg/view?usp=drive_link">시공지침 보기</a>
          <ResponseImage src="/guidebook.png" alt="가이드북" style={{ maxWidth: '100%', marginTop: '12px' }} onClick={() => handleImageClick('/guidebook.png')} />
        </>
      );
    } else if (text === '설비,소방') {
      return (
        <>
          저수조의 설치기준은 다음과 같습니다.<br /><br />
          · 상부 점검구 : 마감에서 1,000mm 이상<br />
          · 탱크 상부, 측면 : 마감에서 600mm 이상<br />
          · 하부 순수패드 : 마감에서 600mm 이상<br /><br />
          자세한 사항은 아래 호반건설 사내 시공표준화를 참고해주시기 바랍니다.<br /><br />
          <ResponseImage src="/guidebook_1.png" alt="가이드북" style={{ maxWidth: '100%', marginTop: '12px' }} onClick={() => handleImageClick('/guidebook_1.png')} />
        </>
      );
    } else if (text === 'TBM(기계)') {
      return (
        <>
          터널 내 운반 지침은 다음과 같습니다.<br /><br />
1. 버력처리 계획 수립 시에는 터널크기, 연장, 경사, 버력량, 버력상태, 사용장비의 특성, 주변여건, 공정 등을 고려하여야 한다.<br /><br />
2. 운반체계 수립 시에는 버력운반이 굴착공정에 지장을 주지 않도록 하여야 한다.<br /><br />
3. 터널 내 운반장비의 안전운행을 위해서는 운행규정을 수립하고 운전원 및 작업원들에게 안전 운행에 관한 교육을 실시하여야 한다.<br /><br />
TBM 운반에 대해서 설명드리겠습니다. <br /><br />
1. 현장까지 TBM이 원활히 운반될 수 있도록 장비분활과 운반로를 선정하여야 한다. 또한 운반 도중에 지상 및 지하구조물에 손상이 발생하지 않도록 현황을 파악하고 대책을 수립하여야 한다.<br /><br />
2. 제작사로부터 현장에 공급될 때까지 외부의 충격 등에 손상되지 않도록  TBM이 보호된 상태로 공급하여야 한다.

        </>
      );
    } else if (text === '공사일보 자동 작성') {
      return (
        <>
        <div style={{ marginBottom: '12px' }}>
          출입관리시스템과 연동하여 공사일보를 자동으로 작성하는 기능입니다. 현장 출입 기록 데이터를 비롯한 다양한 현장 정보를 실시간으로 수집하고, 이를 바탕으로 공사일보(작업일보)를 자동으로 작성합니다. 주요 기능으로는 다음과 같습니다.<br /><br />
          1. 협력업체가 링크를 통해 작업일보를 작성하면 자동으로 공사일보에 반영<br /><br />
          2. 안면인식 카메라를 통한 현장 출력 인원 자동 업데이트<br /><br />
          3. 날짜, 공정률, 공사진행상황, 날씨 데이터등을 자동 업데이트<br /><br />
          AI가 공사일보를 자동으로 작성해주면 이후 담당자가 검토 확인을 거치는 방식으로 '작성 시간과 인력 부담이 줄어들고, 인원, 날씨, 협력업체 작업 등 주요 정보의 누락과 오류가 최소화되며, 현장 상황을 신속하게 파악'할  수 있습니다. 또한 작업일보 및 출입기록대장 데이터와 협력업체가 요구하는 기성의 데이터값이(시공량 및 출력인원) 차이가 크다면 '검토를 바란다'고 담당자에게 알림을 줄 수 있습니다. 이를 통해 업무 효율성과 생산성이 크게 향상됩니다.
          </div>
          <ResponseImage src="/sample_1.png" alt="가이드북" style={{ maxWidth: '100%', marginTop: '12px' }} onClick={() => handleImageClick('/sample_1.png')} />
          <ResponseImage src="/sample_2.png" alt="가이드북" style={{ maxWidth: '100%', marginTop: '12px' }} onClick={() => handleImageClick('/sample_2.png')} />
        </>
      );
    } else if (text === '도면 비교 분석') {
      return (
        <>
        <div style={{ marginBottom: '12px' }}>
          CAD 도면을 넣거나 공유폴더에 연결된 도면이름을 제시하면 두 도면을 비교, 분석하여 상이한 내용 및 간섭사항을 찾아내는 AI프로그램입니다. 다양한 도면 정보를 AI가 자동으로 인식하고, 두 도면간의 차이점과 충돌을 신속하게 도출합니다.<br /><br />
          다음 예시와 같은 방식으로 진행됩니다.<br /><br />
          1. 공유폴더에 연결 되어있는 1901동 지하주차장 건축 평면도와 1901동 지하주차장 구조 평면도등 서로 다른 도면을 비교, 분석합니다.<br /><br />
          2. 두 도면의 휀룸 벽 등 일부 구조물의 상이한 점을 자동 탐지합니다.<br /><br />
          3. 발견된 차이점을 사용자에게 명확하게 제시합니다.<br /><br />
          4. 시공지침, 시방서 등 관련 기준을 바탕으로 해결책까지 AI가 제안합니다.<br /><br />
          AI의 도면 비교· 분석 자동화로 인해 도면 검토 시간이 줄어들고, 주요 정보의 누락과 오류가 최소화되며, 설계 및 시공단계에서의 업무효율성과 정확성이 크게 향상됩니다.
          </div>
          <ResponseImage src="/sample_3.png" alt="가이드북" style={{ maxWidth: '100%', marginTop: '12px' }} onClick={() => handleImageClick('/sample_3.png')} />
        </>
      );
    } else if (text === '오늘의 식단 알아보기') {
      return (
        <>
        <ResponseImage
          src="/menu.png"
          alt="금주의 식단"
          style={{ maxWidth: '100%', marginTop: '12px' }}
          onClick={() => handleImageClick('/menu.png')}
        />
        금일 점심메뉴는 보리밥/현미밥, 순두부찌개, 통가자미 구이, 옛날 소세지전&케찹, 모듬 묵&양념장, 오이사과 초무침/포기김치입니다. 총 892kcal이며, 후식으로는 믹스베리 샐러드와 자몽이 준비되어 있습니다.
        </>
      );
    } else if (text === '플랜P 팀원 알아보기') {
      return (
        <>
          미션 코치 : 김관식 부장님<br/> 
조원 : 황하람, 김용현, 정현우, 정명훈, 박성현 
<br /><br />
          <span style={{fontWeight:"bold",color:"#f07a03"}}>김관식 </span>: Plan P의 미션코치<br />본사에서 공사지원팀으로 근무 중.<br/>
          “그동안 수고 많았습니다. 좋은 결과 있길 응원합니다.” <br /><br />
          <span style={{fontWeight:"bold",color:"#f07a03"}}>황하람</span>: Plan P의 조장 (발표 담당)<br />동북선 도시철도에서 토목직으로 근무 중.<br/>“준비하는 과정이 순탄치만은 않았지만 그만큼 의미있는 시간이었습니다! ”<br /><br />
          <span style={{fontWeight:"bold",color:"#f07a03"}}>김용현</span>: Plan P의 조원(코딩 담당)<br />천안 일봉공원 2BL에서 건축직으로 근무 중.<br/>“이번 프로젝트를 수행하면서, AI를 활용하여 무궁무진한 발전을 할 수 있다는 것을 체감하였습니다.”<br /><br />
          <span style={{fontWeight:"bold",color:"#f07a03"}}>정명훈</span>: Plan P의 조원(코딩 담당)<br />오산세교2 A13BL에서 설비직으로 근무 중.<br/>“현장직도 편하게 회의할 수 있도록 배려해준 덕분에 수월하게 준비할 수 있었습니다. AI시대를 맞이하는 호반건설에서 AI기술을 포함한 신기술을 적극 활용하는 직원으로 성장하겠습니다.”<br /><br />
          <span style={{fontWeight:"bold",color:"#f07a03"}}>정현우</span>: Plan P의 조원(PPT 담당)<br />춘천-속초 1공구에서 TBM 기계직으로 근무 중<br/>“이번 프로젝트를 통해 AI 기술뿐 아니라 문제를 정의하고 풀어가는 방식에서도 많이 성장할 수 있었습니다”<br /><br />
          <span style={{fontWeight:"bold",color:"#f07a03"}}>박상현</span>: Plan P의 조원(PPT 담당)<br />오산세교2 A13BL에서 건축직으로 근무 중.<br/>“이번 프로젝트를 통해 팀원과 협력하여 결과물을 만들어내는 뜻깊은 시간이었습니다.” <br />
        </>
      );
    } else if (text === '시공지침') {
      return (
        <>
          {GUIDE_DETAIL_TEXT.split('\n').map((line, idx) => (
            <React.Fragment key={idx}>
              {line}
              <br />
            </React.Fragment>
          ))}
          <AboutButtonGroup>
            {GUIDE_DETAIL_BUTTONS.map((text, idx) => (
              <AboutButton key={idx} onClick={() => handleButtonClick(text)}>
                {text}
              </AboutButton>
            ))}
          </AboutButtonGroup>
        </>
      );
    } else {
      return (
        <>
          <AboutButtonGroup>
            {ACTION_BUTTONS.map((text, idx) => (
              <AboutButton key={idx} onClick={() => handleButtonClick(text)}>
                {text}
              </AboutButton>
            ))}
          </AboutButtonGroup>
        </>
      );
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
        {messages.map((message, idx) => (
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
                {!message.isUser && idx === messages.length - 1 && messages.length > 1 && message.type !== "welcomeMessage" && (
                  <AboutButtonGroup style={{ marginTop: '14px' }}>
                    <AboutButton isRestart onClick={handleRestart}>다른 질문 시작하기</AboutButton>
                  </AboutButtonGroup>
                )}
              </MessageBubble>
            </MessageContent>
          </MessageWrapper>
        ))}
        <div ref={messagesEndRef} />
      </MessagesContainer>
      {modalImage && (
        <ModalOverlay onClick={handleCloseModal}>
          <ModalImage src={modalImage} alt="확대 이미지" onClick={e => e.stopPropagation()} />
        </ModalOverlay>
      )}
      <ConfirmModal 
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmModal}
      />
    </ChatContainer>
  );
};

export default AboutPage; 