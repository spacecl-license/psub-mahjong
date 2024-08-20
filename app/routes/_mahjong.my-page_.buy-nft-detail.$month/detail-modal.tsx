import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import SvgClose from '~/components/icons/close';

type DetailModalProps = {
  isModalOpen: boolean;
  toggleModal: () => void;
};

const DetailModal: React.FC<DetailModalProps> = ({ isModalOpen, toggleModal }) => {
  const { t } = useTranslation('buy-nft');
  return (
    <div>
      <ModalOverlay
        isOpen={isModalOpen}
        onClick={toggleModal}
      />
      <GuideModal isOpen={isModalOpen}>
        <ModalHeader>
          GUIDE
          <SvgClose onClick={toggleModal} />
        </ModalHeader>
        <div>
          {t('1. 申请购买后，您应使用 \'存款钱包地址 \'中选择的代币付款。2. 付款确认后，NFT 将发送到您的 BNB 钱包地址。3. 这是一个在链上记录的转账操作，因此可能需要一些时间。4. 一旦确认付款，无论是否收到 NFT，您都可以创建游戏。')}
        </div>

      </GuideModal>
    </div>
  );
};

const ModalHeader = styled.div`
  position: relative;
  padding: 1rem 0;
  color: white;
  background-color: var(--sub-color);
  text-align: center;
  font-family: Montserrat;
  font-size: 1rem;
  font-style: normal;
  font-weight: 700;
  line-height: 1rem;
  text-transform: uppercase;
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;

  & > svg {
    position: absolute;
    top: 0;
    right: 0;
    width: 1.25rem;
    height: 1.25rem;
    margin: 0.75rem;
    cursor: pointer;

    path {
      fill: white;
    }
  }
`;

const GuideModal = styled.div<{ isOpen: boolean }>`
  position: fixed; 
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%; 
  max-width: 31.25rem; 
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  z-index: 1000; 
  display: ${props => props.isOpen ? 'block' : 'none'}; 


  & > div:last-child {
    font-family: "Noto Sans";
    font-size: 1rem;
    font-style: normal;
    font-weight: 400;
    line-height: 1.375rem;
    white-space: pre-line;
    padding:1rem;
  }
`;

const ModalOverlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999; 
  display: ${props => props.isOpen ? 'block' : 'none'}; 
`;

export default DetailModal;
