import type { SVGProps } from 'react';
import React from 'react';
import styled from 'styled-components';

import BasicInput from './basic-input';

interface QuantityInputProps {
  label: string;
  icon?: React.FC<SVGProps<SVGSVGElement>>;
  currency: string;
  spanContent?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  name?: string;
}

const QuantityInput: React.FC<QuantityInputProps> = ({
  label, spanContent, currency, icon: Icon, onChange, value, name,
}) => {
  return (
    <Wrapper>
      <BasicInput label={label} >
        {Icon && <Icon />}
        <InputWrapper>
          <input
            name={name || ''}
            type="number"
            onChange={onChange}
            value={value}
          />
          <span>{currency}</span>
        </InputWrapper>
      </BasicInput>
      {spanContent && (
        <MaxValue>
          {spanContent}
        </MaxValue>
      )}
    </Wrapper>
  );
};

export default QuantityInput;

const Wrapper = styled.div`
  width: 100%;

  & > div {
    padding: 0;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    padding: 0.5rem 1rem;
    margin-bottom: 0.5rem;
  }
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;

  & > input {
    width: 90%;
    height: 1.5rem;
    text-align: right;
    color: var(--font-color);
    background-color: var(--bg-color);
    border: none;
    outline: none;
    font-family: "Noto Sans";
    font-size: 1rem;
    font-style: normal;
    font-weight: 700;
    line-height: 1.4rem;
    text-transform: uppercase;
  }

  & > span {
    color: var(--input-dark-sub2);
    font-size: 1rem;
    margin-left: 1rem;
    line-height: 1.4rem;
    font-family: "Noto Sans";
  }
`;

const MaxValue = styled.span`
  display: block;
  text-align: right;
  font-family: "Noto Sans";
  font-size: 0.75rem;
  color: var(--dark-text-sub);
  margin-top: 0.5rem;
`;
