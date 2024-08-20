import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import SvgArrow from '../icons/arrow';
interface ChartItemProps {
  rank: string;
  child: string;
  name: string;
  sales: number;
  income: number;
  isActive: boolean;
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChartItem : React.FC<ChartItemProps> = ({
  rank, child, name, sales, income, isActive, setIsActive,
}) => {

  const { t } = useTranslation('chart');

  const handleIsActive = () => {
    setIsActive(!isActive);
  };

  return (
    <InnerItem>
      <Header>
        <Rank>{rank}</Rank>
        <ChildWrapper
          itsMe={child === t('自己')}
        >
          {child}
        </ChildWrapper>
      </Header>
      <NameWrapper>
        {name}
      </NameWrapper>
      <SalesWrapper>
        <div>{t('销售额')}</div>
        <div>{`${sales ? sales : 0}USD`}</div>
      </SalesWrapper>
      <SalesWrapper>
        <div>{t('收益')}</div>
        <div>{`${income ? income : 0}USD`}</div>
      </SalesWrapper>
      <OpenButton
        isActive={isActive}
        onClick={handleIsActive}
      >
        <SvgArrow />
      </OpenButton>
    </InnerItem>

  );
};

const InnerItem = styled.div`
  padding: 0.75rem 0.5rem;
  background-color: #fff;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap : 0.5rem;
  position: relative;
  height : 8.5rem;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const Rank = styled.div`
  color: var(--cybernetic-Sub2, #FF007A);
  font-family: Montserrat;
  font-size: 0.625rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1rem;
  border: 1px solid transparent;
  background-image: linear-gradient(#fff,#fff),
  linear-gradient(90deg, #12B8FF 0%, #FF007A 100%, #FF007A 100.01%);
  border-radius: 9999px;
  background-origin:border-box; 
  background-clip:padding-box, border-box;
  padding: 0 0.75rem;
`;

const ChildWrapper = styled.div<{ itsMe : boolean }>`
  color : ${({ itsMe }) => (itsMe ? '#FF007A' : '#AAAAAA')};
  text-align: right;
  font-family: "Noto Sans SC";
  font-size: 0.625rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1rem; 
`;

const NameWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  color: var(--hanafuda-Text, #121212);
  text-align: center;
  font-family: "Noto Sans SC";
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.25rem; 
`;

const SalesWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;

  & > div:first-child {
    color: var(--cybernetic-Sub-color, #3B3F88);
    font-family: "Noto Sans SC";
    font-size: 0.75rem;
    font-style: normal;
    font-weight: 400;
    line-height: 1.25rem;
  }

  & > div:last-child {
    color: var(--hanafuda-Text, #121212);
    font-family: "Noto Sans SC";
    font-size: 0.875rem;
    font-style: normal;
    font-weight: 700;
    line-height: 1.25rem; 
  }
`;

const OpenButton = styled.div<{isActive : boolean}>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 1.25rem;
  height: 1.25rem;
  position: absolute;
  background: ${({ isActive }) => (isActive ? 'linear-gradient(270deg, #1B68DC 0%, #3FCBD4 100%,#3FCBD4 100.01% )' : '#fff')};
  filter: drop-shadow(0px 0px 4px rgba(0, 0, 0, 0.20));
  border-radius: 50%;
  cursor: pointer;
  top: 50%;
  right: -0.7rem;
  transform: translateY(-50%);

  & > svg {
    width: 0.75rem;
    height: 0.75rem;
    transform: ${({ isActive }) => (isActive ? 'rotate(90deg)' : 'rotate(270deg)')};

    path {
      fill: ${({ isActive }) => (isActive ? '#fff' : '#12B8FF')};
    }
  }
`;

export default ChartItem;
