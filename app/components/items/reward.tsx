import React from 'react';
import styled from 'styled-components';

import { useTheme } from '~/hooks/use-theme';

interface RewardItemProps {
  src: string;
  alt: string;
  month: number;
  quantity: number;
  onClick?: () => void;
  name: string;
}

const RewardItem: React.FC<RewardItemProps> = ({
  src, alt, quantity, month, onClick, name,
}) => {
  const [theme] = useTheme();
  return (
    <ImgWrapper
      hasQuantity={quantity > 0}
      onClick={onClick}
      theme={theme}
    >
      <Label
        hasQuantity={quantity > 0}
        theme={theme}
      >
        {name}
      </Label>
      <img
        src={src}
        alt={alt}
      />
      {quantity > 0 ? (
        <Footer>
          {quantity}
          <span>
            EA
          </span>
        </Footer>
      ) : (
        <NoneWrapper>
          NONE
        </NoneWrapper>
      )}
    </ImgWrapper>
  );
};

export default RewardItem;

const ImgWrapper = styled.div<{ hasQuantity: boolean, theme : string }>`
  flex: 1;
  min-width: calc((100% - 3rem) / 4);
  max-width: calc((100% - 3rem) / 4);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: ${({ hasQuantity }) => (hasQuantity ? 1 : 0.5)};
  box-shadow: ${({ theme, hasQuantity }) => {
    if (theme === 'dark') {
      if (hasQuantity){
        return '0px 0px 7px 0px rgba(18, 184, 255, 0.70)';
      } else {
        return 'none';
      }
    } else {
      return '0px 0px 7px 0px rgba(0, 0, 0, 0.25)';
    }
  }
};
  background-color: var(--bg);
  position: relative;
  border: ${({ theme, hasQuantity }) => {
    if (theme === 'dark') {
      if (hasQuantity){
        return '1px solid var(--dark-sub)';
      } else {
        return '1px solid var(--dark-gray-3)';
      }
    } else {
      return 'none';
    }
  }};

  & > img {
    width: 100%;
    height: auto;
  }


`;

const Label = styled.div<{ hasQuantity: boolean, theme : string }>`
  position: absolute;
  top: 0;
  right: 0;
  background-color: ${({ theme, hasQuantity }) => {
    if (theme === 'dark') {
      if (hasQuantity){
        return 'var(--dark-sub3)';
      } else {
        return 'var(--dark-gray-3)';
      }
    } else {
      return 'var(--sub-color)';
    }
  }};
  padding: 0 0.5rem !important;
  color: white;
  text-align: center;
  font-family: Montserrat;
  font-size: 0.4rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1rem;  
  text-transform: uppercase;
  margin: 0.21rem 0.31rem;
  border-radius: 9999px;
`;

const Footer = styled.div`
  text-align: center;
  font-size: 0.75rem;
  font-style: normal;
  font-weight: 500;
  line-height: 1rem;    
  text-transform: uppercase;
  padding: 0.5rem;
  color : var(--font-color);

  & > span {
    color: var(--header-global-color);
    margin-left: 0.25rem;
  }
`;

const NoneWrapper = styled.div`
  text-align: center;
  font-size: 0.75rem;
  font-style: normal;
  font-weight: 500;
  line-height: 1rem;    
  text-transform: uppercase;
  padding: 0.5rem;
  color : var(--none);
`;
