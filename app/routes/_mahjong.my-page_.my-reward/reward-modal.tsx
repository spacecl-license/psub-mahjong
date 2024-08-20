import { useLoaderData } from '@remix-run/react';
import clsx from 'clsx';
// import React, { useMemo } from 'react';
import styled from 'styled-components';

import BasicButton from '~/components/button/basic-button';
import PsubInput from '~/components/input/psub-input';

// import BonusItem from '~/components/items/bonus-item';
import type { QuantifyReward } from './route';
import type { loader } from './server';

export { action, loader, meta } from './server';

type RewardModalProps = {
  isModalOpen: boolean;
  toggleModal: () => void;
  selectedReward: QuantifyReward;
};

const RewardModal: React.FC<RewardModalProps> = ({
  isModalOpen, toggleModal, selectedReward,
}) => {

  const { coinPrice } = useLoaderData<typeof loader>();

  const totalAmount = selectedReward.quantity * selectedReward.price;

  // const bonus = useMemo(() => {
  //   const bonusRates = [
  //     '0.2',
  //     '0.3',
  //     '0.5',
  //     '1',
  //     '2',
  //     '10',
  //   ];
  //   let results: any[] = [];

  //   const quantities = selectedReward.quantitiesByBonusRate || {};

  //   bonusRates.forEach(rate => {
  //     const count = quantities[rate] || 0;

  //     results.push({
  //       bonus: Number(rate) * 100,
  //       count,
  //     });

  //   });

  //   return results;
  // }, [selectedReward]);

  return (
    <div>
      <ModalOverlay
        isOpen={isModalOpen}
        onClick={toggleModal}
      />
      <GuideModal isOpen={isModalOpen}>
        <ModalHeader>
          REWARD VALUE
        </ModalHeader>
        <ModalContent>
          <div>
            <img
              src={selectedReward.image}
              alt={`${selectedReward.month}月`}
            />
            <div
              className={clsx(['small-info-border'])}
            >
              <div
                className={clsx(['small-info'])}
              >
                {selectedReward.name}
              </div>
              <div>
                <div>
                  <ContentHeader>REWARD</ContentHeader>
                  <Content>
                    {selectedReward.price}
                    <span>PsuB</span>
                  </Content>
                </div>
                <div>
                  <ContentHeader>AMOUNT</ContentHeader>
                  <Content>
                    {selectedReward.quantity}
                    <span>EA</span>
                  </Content>
                </div>
              </div>
            </div>
          </div>
          {/* <BonusWrapper>
            {bonus.map((item, index) => (
              <BonusItem
                key={index}
                bonus={item.bonus}
                count={item.count}
              />
            ))}
          </BonusWrapper> */}
          <PsubInput
            value={totalAmount}
            label="TOTAL PSUB REWARD"
            usdEquivalent={Number((coinPrice.USD * totalAmount).toFixed(2))}
            yenEquivalent={Number((coinPrice.CNY * totalAmount).toFixed(2))}
          />
          <BasicButton onClick={toggleModal}>CLOSE</BasicButton>
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
  max-height: 32rem;
  overflow-y: auto;
  
  & > div:first-child {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;

    & > img {
      width: 7.5rem;
      height: 12rem;
      flex-shrink: 0;
      border : 1px solid var(--modal-border-color);
    }

    & > div {
      display: flex;
      flex-direction: column;
      width: 8.9375rem;
      height: 12rem;

      & > div:first-child {
        display: flex;
        height: 2.5rem;
        justify-content: center;
        align-items: center;
        color: white;
        font-family: "Noto Sans SC";
        font-size: 1.125rem;
        font-style: normal;
        font-weight: 500;
        line-height: 2rem;
        border-top-left-radius: 0.5rem;
        border-top-right-radius: 0.5rem;
      }

      & > div:last-child {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 1rem;
        border-bottom-left-radius: 0.5rem;
        border-bottom-right-radius: 0.5rem;
        height: 9.5rem;
      }
    }
  }

  & > div:nth-child(2) {
    margin-bottom: 0;

    & > span {
      top : -0.675rem;
    }
  }

  & > button {
    margin-top: 2.5rem;
  }
`;

const ContentHeader = styled.div`
  color: var(--event-color);
  font-family: Montserrat;
  font-size: 1rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1rem;
  text-transform: uppercase;
`;

const Content = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  color: var(--font-color);
  font-family: "Noto Sans SC";
  font-size: 1.125rem;
  font-style: normal;
  font-weight: 500;
  line-height: 2rem; 

  & > span {
    color: var(--receipt-date-color);
    font-family: "Noto Sans SC";
    font-size: 1rem;
    font-style: normal;
    font-weight: 400;
    line-height: 2rem; 
    margin-left: 0.3rem;  
  }
`;

// const BonusWrapper = styled.div`
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   flex-wrap: wrap;
//   gap: 1rem;
//   margin-bottom: 2rem;
// `;

export default RewardModal;
