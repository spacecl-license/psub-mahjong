import clsx from 'clsx';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import SvgSale from '../icons/sale';

interface InputFieldProps {
  id?: string;
  name?: string;
  type: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
}

const TransactionInput: React.FC<InputFieldProps> = ({
  id,
  name,
  type,
  onChange,
  value,
}) => {
  const { t } = useTranslation('setting');
  return (
    <InputContainer
      className={clsx(['primary'])}
    >
      <Label>{t('交易密码')}</Label>
      <IconWrapper><SvgSale /></IconWrapper>
      <StyledInput
        id={id}
        name={name}
        type={type}
        onChange={onChange}
        value={value}
      />
    </InputContainer>
  );
};

export default TransactionInput;

const Label = styled.span`
  position: absolute;
  left: 0.625rem; 
  top: -0.475rem;
  background-color: var(--bg-color);
  color: var(--input-dark-sub);
  font-size: 1rem;
  border-radius: 0.5rem;
  padding: 0 0.3125rem;
  font-family: Montserrat;
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

const StyledInput = styled.input`
  flex-grow: 1;
  width: 100%;
  outline: none;
  font-size: 1rem;
  background-color: transparent;
  vertical-align: middle;
  color: var(--font-color);
  border-color: var(--main-color);
`;

const InputContainer = styled.div`
  width: 100%;
  position: relative;
  display: flex;
  align-items: center;
  background-color: white;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-top: 1.25rem;
  margin-bottom: 2.5rem;
`;
