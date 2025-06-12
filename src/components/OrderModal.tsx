import React from 'react';
import styled from '@emotion/styled';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  type: 'confirm' | 'success';
}

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 24px;
  border-radius: 16px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const ModalTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
  text-align: center;
`;

const ModalText = styled.p`
  font-size: 16px;
  color: #666;
  margin-bottom: 24px;
  white-space: pre-line;
  line-height: 1.6;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
`;

const Button = styled.button<{ isConfirm?: boolean }>`
    width: 100%;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  background-color: ${props => props.isConfirm ? '#f07a03' : '#e0e0e0'};
  color: ${props => props.isConfirm ? 'white' : '#333'};
  transition: all 0.2s ease;

  &:hover {
    background-color: ${props => props.isConfirm ? '#d86a00' : '#d0d0d0'};
  }
`;

const OrderModal: React.FC<OrderModalProps> = ({ isOpen, onClose, onConfirm, type }) => {
  if (!isOpen) return null;

  const orderDetails = `자재 : 레미탈 400포(개당 가격 4549원)
총 가격 :  1,819,600원
도착 예정시기 : 6월 26일
주문 업체 : ㅁㅁ레미탈
업체 담당자 : 정명훈 (전화번호 : 010-xxxx-xxxx)`;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        {type === 'confirm' ? (
          <>
            <ModalTitle>발주 확인</ModalTitle>
            <ModalText>{orderDetails}</ModalText>
            <ModalText>주문하시겠습니까?</ModalText>
            <ButtonGroup>
              <Button isConfirm onClick={onConfirm}>예</Button>
              <Button onClick={onClose}>아니요</Button>
            </ButtonGroup>
          </>
        ) : (
          <>
            <ModalTitle>발주 완료</ModalTitle>
            <ModalText>발주가 접수되었습니다</ModalText>
            <ButtonGroup>
              <Button isConfirm onClick={onClose}>확인</Button>
            </ButtonGroup>
          </>
        )}
      </ModalContent>
    </ModalOverlay>
  );
};

export default OrderModal; 