import React from 'react';
import styled from 'styled-components';

import { useTheme } from '~/hooks/use-theme';

import SvgProhibition from '../icons/prohibition';

interface RandomBoxItemProps {
  quantity: number;
  onClick?: () => void;
  name: string;
}

const RandomBoxItem : React.FC<RandomBoxItemProps> = ({
  quantity, onClick, name,
}) => {
  const [theme] = useTheme();
  return (
    <ImgWrapper
      hasQuantity={quantity > 0}
      onClick={onClick}
      theme={theme}
    >
      <CardImageWrapper
        hasQuantity={quantity > 0}
        theme={theme}
      >
        <CardImage
          src="/images/random-box.jpg"
          alt="Reward"
          hasQuantity={quantity > 0}
        />
      </CardImageWrapper>
      {quantity === 0 && (
        <Prohibited>
          <SvgProhibition />
        </Prohibited>
      )}
      <Label
        hasQuantity={quantity > 0}
      >
        {name}
      </Label>
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

const ImgWrapper = styled.div<{ hasQuantity: boolean, theme : string }>`
  flex: 1;
  min-width: calc((100% - 2rem) / 3);
  max-width: calc((100% - 2rem) / 3);
  display: flex;
  border-radius: 0.5rem;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
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
  background-color: var(--bg-color);
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
`;

const CardImageWrapper = styled.div<{ hasQuantity?: boolean, theme : string }>`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center; 
  overflow: hidden;
  border-radius: 0.4rem 0.4rem 0 0;
`;

const CardImage = styled.img<{hasQuantity?: boolean}>`
  width: 100%;
  height: auto;
  opacity: ${({ hasQuantity }) => (hasQuantity ? 1 : 0.5)};
`;

const Prohibited = styled.div`
  top: 50%;
  left: 50%;
  position: absolute;
  opacity: 1 !important;

  & > svg {
    width: 4.8rem;
    height: 4.8rem;
    transform: translate(-50%, -90%);

    path {
      fill: var(--dark-text-sub);
    }

  }
`;

const Label = styled.div<{hasQuantity?: boolean}>`
  text-align: center;
  font-family: "Noto Sans SC";
  font-size: 1.125rem;
  font-style: normal;
  font-weight: 500;
  line-height: 1.125rem; 
  color: ${({ hasQuantity }) => (hasQuantity ? 'var(--random-box-text-color)' : 'var(--random-box-text-color2)')};
  padding: 0.5rem 0;
`;

const Footer = styled.div`
  text-align: center;
  font-size: 0.75rem;
  font-style: normal;
  font-weight: 500;
  line-height: 1rem;    
  text-transform: uppercase;
  padding: 0 0.5rem 0.5rem 0.5rem;
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
  padding: 0 0.5rem 0.5rem 0.5rem;
  color : var(--dark-text-sub);
`;

export default RandomBoxItem;
