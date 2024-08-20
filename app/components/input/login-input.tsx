import clsx from 'clsx';
import type { SVGProps } from 'react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

interface InputFieldProps {
  icon?: React.FC<SVGProps<SVGSVGElement>>;
  id?: string;
  name?: string;
  value?: string;
  type: string;
  label: string;
  onVerifyClick?: () => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

const LoginInput: React.FC<InputFieldProps> = ({
  icon: Icon,
  id,
  name,
  value,
  type,
  label,
  onVerifyClick,
  onChange,
  disabled,
}) => {
  const { t } = useTranslation('regist');
  return (
    <InputContainer
      className={clsx(['focus'])}
    >
      <Label>{label}</Label>
      {Icon && <IconWrapper><Icon /></IconWrapper>}
      <StyledInput
        id={id}
        value={value || ''}
        name={name}
        type={type}
        onChange={onChange}
        disabled={disabled}
      />
      {onVerifyClick && (
        <VerifyButton
          type="button"
          onClick={onVerifyClick}
        >
          {t('验证')}
        </VerifyButton>
      )}
    </InputContainer>
  );
};

export default LoginInput;

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

const StyledInput = styled.input`
  flex-grow: 1;
  width: 100%;
  border: none;
  outline: none;
  font-size: 1rem;
  background-color: transparent;
  vertical-align: middle;
  color: var(--font-color);
`;

const VerifyButton = styled.button`
  background-color: white;
  color: var(--gray); 
  font-weight: 700;
  white-space: nowrap;
  border: 0.0625rem solid var(--gray);
  border-radius: 0.8rem;
  padding: 0.3125rem 0.5rem;
  margin-left: 0.625rem;
  cursor: pointer;
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

    ${VerifyButton} {
      color: var(--main-color);
      border-color: var(--main-color);
    }
  }
`;
