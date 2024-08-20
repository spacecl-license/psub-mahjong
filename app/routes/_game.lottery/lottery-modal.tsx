import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import BasicButton from '~/components/button/basic-button';

type LotteryModalProps = {
  isModalOpen: boolean;
  toggleModal: () => void;
  days : Array<number>;
  amount : number;
};

const LotteryModal: React.FC<LotteryModalProps> = ({
  isModalOpen, toggleModal, days, amount,
}) => {
  const { t } = useTranslation('game-hub');

  const totalDelayDays = days.reduce((a, b) => a + b, 0);
  return (
    <div>
      <ModalOverlay
        isOpen={isModalOpen}
        onClick={toggleModal}
      />
      <GuideModal isOpen={isModalOpen}>
        <ModalHeader>
          {t('幸运抽开放!')}
        </ModalHeader>
        <div>
          {`${t('恭喜您!')}
          ${t('您已获得了')} ( ${amount} )PsuB.

          ${t('将在挖矿')} ( ${totalDelayDays} )${t('天后支付。')}`}
          {/* <ResultWrapper>
            {days.map((day, index) => (
              <div key={index}>{day}</div>
            ))}
          </ResultWrapper> */}

          <BasicButton onClick={toggleModal}>{t('继续打开')}</BasicButton>
        </div>
      </GuideModal>
    </div>
  );
};

const ModalHeader = styled.div`
  position: relative;
  padding: 1rem 0;
  color: white;
  background-color: var(--modal-header-color);
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
  text-align: center;
  font-family: Montserrat;
  font-size: 1rem;
  font-style: normal;
  font-weight: 700;
  line-height: 1rem;
  text-transform: uppercase;

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
  background-color: var(--modal-content-color);
  backdrop-filter: blur(12px);
  border-radius: 0.5rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  z-index: 1000; 
  display: ${props => props.isOpen ? 'block' : 'none'}; 
  border : 1px solid var(--modal-border-color);


  & > div:last-child {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    text-align: center;
    font-family: "Noto Sans";
    font-size: 1rem;
    font-style: normal;
    font-weight: 400;
    line-height: 1.375rem;
    white-space: pre-line;
    padding: 1.5rem 1rem 0 1rem;
    color: var(--font-color);

    & > svg {
      width: 3.75rem;
      height: 3.75rem;
      margin-bottom: 1.5rem;
      path {
        fill: var(--input-dark-sub2);
      }
    }

    & > button {
      margin: 2.5rem 0;
    }
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

// const ResultWrapper = styled.div`
//   display: flex;
//   justify-content: space-around;
//   margin-top: 2.5rem;
//   border: 8px solid transparent;
//   border-image: url('/images/border-image.png') 74 round;
//   padding: 1rem 1.25rem;
//   gap: 0.5rem;

//   & > div {
//     padding: 0.5rem;
//     color: var(--cybernetic-text, #FCFCFC);
//     text-align: center;
//     font-family: Montserrat;
//     font-size: 1rem;
//     font-style: normal;
//     font-weight: 700;
//     line-height: 1.375rem;
//     border-radius : 50%;
//     border : 1px solid var(--game-gold);
//     width: 2.6rem;
//   }
// `;

export default LotteryModal;
