import clsx from 'clsx';
import React from 'react';
import styled from 'styled-components';

import SvgStar from '../icons/star';

interface BonusItemProps {
  bonus: string;
  count: number;
}

const BonusItem: React.FC<BonusItemProps> = ({ bonus, count }) => {
  return (
    <div>
      {count === 0 ? (
        <Wrapper >
          <div >
            <SvgStar />
            +
            {bonus}
            %
          </div>
          <div>
            <div>
              <NoneWrapper>
                NONE
              </NoneWrapper>
            </div>
          </div>
        </Wrapper>
      ) : (
        <Wrapper
          className={clsx(['bonus-info-border'])}
        >
          <div
            className={clsx(['bonus-info'])}
          >
            <SvgStar />
            +
            {bonus}
            %
          </div>
          <div>
            <div>
              <Content>
                {count}
                <span>EA</span>
              </Content>
            </div>
          </div>
        </Wrapper>
      )}
    </div>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 5.1rem;
  height: 4.5rem;
  border-radius: 0.5rem;
  overflow: hidden;
  border: 1px solid var(--bonus-border);

  & > div:first-child {
    display: flex;
    padding: 0.31rem 0.5rem;
    justify-content: space-between;
    align-items: center;
    color: #FFF;
    text-align: right;
    font-family: Montserrat;
    font-size: 0.75rem;
    font-style: normal;
    font-weight: 700;
    line-height: 0.75rem;
    text-transform: uppercase;
    background: var(--bonus-header-bg);
    height: 2rem;

    & > svg {
      width: 0.875rem;
      height: 0.875rem;

      path {
        fill: white;
      }
    }
  }

  & > div:last-child {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0.56rem;
    border-bottom-left-radius: 0.5rem;
    border-bottom-right-radius: 0.5rem;
    height: 2.5rem;
  }
`;

const Content = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--font-color);
  font-family: "Noto Sans SC";
  font-size: 1.125rem;
  font-style: normal;
  font-weight: 500;
  line-height: 1.375rem; 

  & > span {
    color: var(--receipt-date-color);
    font-family: "Noto Sans SC";
    font-size: 1rem;
    font-style: normal;
    font-weight: 400;
    line-height: 1rem; 
    margin-left: 0.3rem;  
  }
`;

const NoneWrapper = styled.div`
  text-align: center;
  font-family: "Noto Sans SC";
  font-size: 1rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.375rem; 
  color: var(--bonus-color);
`;

export default BonusItem;
