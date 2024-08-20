import clsx from 'clsx';
import React, { useState } from 'react';
import styled from 'styled-components';

interface InputFieldProps {
  id?: string;
  name?: string;
  label : string;
  type: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  value?: string;
  maxLength?: number;
}

const InquiryInput: React.FC<InputFieldProps> = ({
  id,
  name,
  type,
  label,
  onChange,
  placeholder,
  value,
  maxLength,
}) => {
  const [inputLength, setInputLength] = useState(0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputLength(e.target.value.length);
    onChange?.(e);
  };
  return (
    <InputContainer
      className={clsx(['primary'])}
    >
      <Label>{label}</Label>
      <StyledInput
        id={id}
        name={name}
        type={type}
        maxLength={maxLength}
        onChange={handleInputChange}
        value={value}
        placeholder={placeholder}
      />
      {maxLength && (
        <TextLengthIndicator>
          {inputLength}
          /
          {maxLength}
        </TextLengthIndicator>
      )}
    </InputContainer>
  );
};

export default InquiryInput;

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

const StyledInput = styled.input`
  flex-grow: 1;
  width: 100%;
  outline: none;
  font-size: 1rem;
  background-color: transparent;
  vertical-align: middle;
  color: var(--font-color);

  ::placeholder {
    color: #777;
    font-family: "Noto Sans SC";
    font-size: 1rem;
    font-style: normal;
    font-weight: 400;
    line-height: 1.375rem; 
  }
`;

const InputContainer = styled.div`
  width: 100%;
  position: relative;
  display: flex;
  align-items: center;
  background-color: var(--bg-color);
  border-radius: 0.5rem;
  padding: 1rem;
  margin-top: 1.25rem;
  margin-bottom: 1.5rem;
`;

const TextLengthIndicator = styled.div`
  margin-left: 0.625rem;
  white-space: nowrap;
  color: var(--dark-text-sub);
  text-align: right;
  font-family: "Noto Sans SC";
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1rem;
`;
