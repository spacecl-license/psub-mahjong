import { useFetcher } from '@remix-run/react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import BasicButton from '~/components/button/basic-button';
import SvgMinus from '~/components/icons/minus';
import SvgPlus from '~/components/icons/plus';

import type { QuantifyRandomBox } from './route';

export { loader, meta } from './server';

type RandomBoxModalProps = {
  isModalOpen: boolean;
  toggleModal: () => void;
  selectedReward: QuantifyRandomBox;
};

const RandomBoxModal: React.FC<RandomBoxModalProps> = ({
  isModalOpen, toggleModal, selectedReward,
}) => {

  const { t } = useTranslation('my-reward');
  const [quantity, setQuantity] = useState(1);

  const fetcher = useFetcher();

  // 수량 감소 함수
  const decreaseQuantity = () => {
    setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  };

  // 수량 증가 함수
  const increaseQuantity = () => {
    setQuantity(prev => (prev < selectedReward.quantity ? prev + 1 : prev));
  };

  const openRandomBox = async () => {
    fetcher.submit({
      level : selectedReward.month,
      quantity,
    }, {
      action: '/api/random-box-open',
      method: 'POST',
    });
  };

  const isLoading = fetcher.state === 'loading';

  return (
    <div>
      <ModalOverlay
        isOpen={isModalOpen}
        onClick={toggleModal}
      />
      <GuideModal isOpen={isModalOpen}>
        <ModalHeader>
          {t('幸运盲盒打开')}
        </ModalHeader>
        <ModalContent>
          <ImgWrapper>
            <Img src="/images/random-box.jpg" />
            <ImgLabel>{`${selectedReward.name} Random Box`}</ImgLabel>
          </ImgWrapper>
          <RewardWrapper>
            <div>
              {t('数额')}
            </div>
            <CountWrapper>
              <SvgMinus onClick={decreaseQuantity} />
              <Count>
                {quantity}
              </Count>
              <SvgPlus onClick={increaseQuantity} />
            </CountWrapper>
          </RewardWrapper>
          <BalanceWrapper>
            {`${t('最多可打开')} ${selectedReward.quantity}${t('个')}`}
          </BalanceWrapper>
          <ButtonWrapper>
            <BasicButton
              onClick={toggleModal}
              variant="reversal"
            >
              {t('取消')}
            </BasicButton>
            <BasicButton
              onClick={openRandomBox}
              disabled={isLoading}
            >
              {t('打开')}
            </BasicButton>
          </ButtonWrapper>
        </ModalContent>
      </GuideModal>
    </div>
  );
};

const ModalHeader = styled.div`
  position: relative;
  padding: 1.063rem 0 1rem 0;
  color: white;
  background-color: var(--modal-header-color2);
  text-align: center;
  font-family: Montserrat;
  font-size: 1rem;
  font-style: normal;
  font-weight: 700;
  line-height: 1rem;
  text-transform: uppercase;
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;

`;

const GuideModal = styled.div<{ isOpen: boolean }>`
  position: fixed; 
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20rem; 
  max-width: 31.25rem; 
  background-color: var(--bg-color);
  border-radius: 0.5rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  z-index: 1000; 
  display: ${props => props.isOpen ? 'block' : 'none'}; 
  border : 1px solid var(--modal-border-color);


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

const ModalContent = styled.div`
  padding: 1rem;
  
`;

const ImgWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1.5rem;
  position: relative;
`;

const Img = styled.img`
  width: 100%;
  height: auto;
`;

const ImgLabel = styled.div`
  position: absolute;
  bottom: 7%;
  left: 10%;
  width: 14.3125rem;
  color: #FFF;
  text-align: center;
  font-family: "Noto Sans SC";
  font-size: 1.125rem;
  font-style: normal;
  font-weight: 500;
  line-height: 2rem;
  background-color: #555;
  border-radius: 9999px;
  padding: 0.2rem 0;
`;

const RewardWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  
  & > div:first-child {
    color : var(--event-color);
    font-family: Montserrat;
    font-size: 1rem;
    font-style: normal;
    font-weight: 400;
    line-height: 1rem; /* 100% */
    text-transform: uppercase;
  }
`;

const CountWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;

  & > svg:nth-child(1) {
    width: 1.5rem;
    height: 1.5rem;

    path {
      fill: var(--minus-button-color);
    }
  }

  & > svg:nth-child(3) {
    width: 1.5rem;
    height: 1.5rem;

    path {
      fill: var(--plus-button-color);
    }
  }
`;

const Count = styled.div`
  width: 4.625rem;
  color: var(--font-color);
  text-align: center;
  font-family: Montserrat;
  font-size: 1.5rem;
  font-style: normal;
  font-weight: 700;
  line-height: 1.5rem;
  text-transform: uppercase;
  border : 1px solid var(--random-box-border);
  padding: 0.5rem 1rem;
`;

const BalanceWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1.5rem;
  color: #AAA;
  text-align: right;
  font-family: "Noto Sans";
  font-size: 0.75rem;
  font-style: normal;
  font-weight: 400;
  line-height: 0.75rem;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1rem;
  gap: 1rem;
`;

export default RandomBoxModal;
