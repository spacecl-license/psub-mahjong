import clsx from 'clsx';
import type { SVGProps } from 'react';
import React from 'react';
import styled from 'styled-components';

import { formatWalletAddress } from '~/hooks/wallet-slice';

import SvgCopy from '../icons/copy';

interface InputFieldProps {
  label: string;
  content: any;
  wallet?: boolean;
  icon?: React.FC<SVGProps<SVGSVGElement>>;
}

const CopyInput: React.FC<InputFieldProps> = ({
  label, content, wallet,  icon: Icon,
}) => {
  const handleCopy = (content : any) => {
    navigator.clipboard.writeText(content);
    alert('Copied to clipboard.');
  };

  return (
    <InputContainer
      className={clsx(['primary'])}
    >
      <Label>{label}</Label>
      <StyledDiv>
        {Icon && <IconWrapper><Icon /></IconWrapper>}
        {wallet ? formatWalletAddress(content)  : content}
      </StyledDiv>
      <SvgCopy onClick={() => handleCopy(content)} />
    </InputContainer>
  );
};

export default CopyInput;

const Label = styled.span`
  position: absolute;
  left: 0.625rem; 
  top: -0.575rem;
  background-color: var(--bg-color);
  color: var(--input-dark-sub);
  font-size: 1rem;
  border-radius: 0.5rem;
  padding: 0 0.3125rem;
  font-family: Montserrat;
`;

const StyledDiv = styled.div`
  flex-grow: 1;
  border: none;
  outline: none;
  background-color: transparent;
  color: var(--font-color);
  white-space: nowrap;
  font-family: "Noto Sans";
  font-size: 1.125rem;
  font-style: normal;
  font-weight: 700;
  line-height: 2rem;
  margin-right: 1rem;
`;

const InputContainer = styled.div`
  width: 100%;
  position: relative;
  display: flex;
  align-items: center;
  background-color: var(--bg-color);
  border-radius: 0.5rem; 
  padding: 1rem;
  margin: 0.625rem 0;

  & > svg {
    width: 1.5rem;
    height: 1.5rem;

    path {
      fill: var(--input-dark-sub2);
    }
  }
`;

const IconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 1.5rem;
  height: 1.5rem; 
  margin-right: 0.625rem;

  svg {
    path {
      fill: var(--input-dark-sub2);
    }
    width: 1.5rem;
    height: 1.5rem;
  }
`;
