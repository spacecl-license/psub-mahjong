import clsx from 'clsx';
import type { SVGProps } from 'react';
import React, { useRef, useState } from 'react';
import styled from 'styled-components';

import SvgDontLook from '../icons/dont-look';
import SvgLook from '../icons/look';

interface InputFieldProps {
  icon?: React.FC<SVGProps<SVGSVGElement>>;
  id?: string;
  name?: string;
  label: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PasswordInput: React.FC<InputFieldProps> = ({
  icon: Icon,
  id,
  name,
  label,
  value,
  onChange,
}) => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const togglePasswordVisibility = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.preventDefault();
    setPasswordVisible(!passwordVisible);

    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <InputContainer
      className={clsx(['focus'])}
    >
      <Label>{label}</Label>
      {Icon && <IconWrapper><Icon /></IconWrapper>}
      <StyledInput
        ref={inputRef}
        id={id}
        name={name}
        type={passwordVisible ? 'text' : 'password'}
        value={value || ''}
        onChange={onChange}
      />
      <PasswordIconWrapper onClick={togglePasswordVisibility}>
        {passwordVisible ? <SvgLook />  : <SvgDontLook />}
      </PasswordIconWrapper>
    </InputContainer>
  );
};

export default PasswordInput;

const Label = styled.span`
  position: absolute;
  left: 0.625rem; 
  top: -0.475rem;
  background-color: var(--bg-color);
  color: var(--gray);
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
      fill: var(--gray);
    }
    width: 1.5rem;
    height: 1.5rem;
  }
`;

const PasswordIconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 1.5rem;
  height: 1.5rem; 
  margin-right: 0.625rem;

  svg {
    path {
      fill: var(--gray);
    }
    width: 1.5rem;
    height: 1.5rem;
  }
`;

const StyledInput = styled.input`
  flex-grow: 1;
  width: 100%;
  font-size: 1rem;
  vertical-align: middle;
  border: none;
  outline: none;
  background-color: transparent;
  color: var(--font-color);
  &:focus {
    border-color: var(--main-color);
  }
`;

const InputContainer = styled.div`
  width: 100%;
  position: relative;
  display: flex;
  align-items: center;
  background-color: var(--bg-color);
  border: 0.0625rem solid var(--gray);
  border-radius: 0.5rem;
  padding: 1rem;
  margin: 0.625rem 0;
  &:focus-within {

    ${Label} {
      color: var(--input-dark-sub);
    }

    ${IconWrapper} {
     & > svg {
        path {
         fill : var(--input-dark-sub2);
      }
      }
    }

    ${PasswordIconWrapper} {
      & > svg {
        path {
          fill : var(--input-dark-sub2);
        }
      }
    }
  }
`;
