import clsx from 'clsx';
import React from 'react';
import styled from 'styled-components';

import SvgArrow from '../icons/arrow';

interface SelectInputProps {
  label: string;
  options: Array<{ value: string; label: string }>;
  selectedValue?: string;
  onChange?: (value: string) => void;
  name?: string;
  spanContent?: string;
}

const SelectInput: React.FC<SelectInputProps> = ({
  label, options, selectedValue, onChange, name, spanContent,
}) => {
  return (
    <Wrapper>
      <Section
        className={clsx(['primary'])}
      >
        <Label>{label}</Label>
        <ContentWrapper>
          <CustomSelect
            value={selectedValue}
            onChange={(e) => onChange && onChange(e.target.value)}
            name={name}
          >
            {options.map((option, index) => (
              <option
                key={index}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </CustomSelect>
        </ContentWrapper>
        <SvgWrapper>
          <SvgArrow />
        </SvgWrapper>
      </Section>
      {spanContent && (
        <SpanContent>
          {spanContent}
        </SpanContent>
      )}
    </Wrapper>
  );
};

export default SelectInput;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const Section = styled.div`
  position: relative;
  /* border: 1px solid var(--main-color); */
  border-radius: 8px;
  width: 100%; 
  text-align: center;
`;

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

const ContentWrapper = styled.div` 
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const CustomSelect = styled.select`
  width: 100%;
  white-space: nowrap;  
  font-family: "Noto Sans";
  font-size: 1.125rem;
  font-style: normal;
  font-weight: 700;
  line-height: 2rem; 
  background-color: var(--bg-color);
  border: none;
  outline: none;
  color: var(--font-color);
  appearance: none; 
  border-radius: 0.5rem;
  padding : 0.2rem 1rem 0 1rem;
  height: 4rem;
`;

const SvgWrapper = styled.div`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;

  svg {
    width: 2rem;
    height: 2rem;
    path {
      fill: var(--input-dark-sub2);
    }
  }
`;

const SpanContent = styled.span`
  display: block;
  text-align: center;
  font-family: "Noto Sans";
  font-size: 0.75rem;
  color: var(--dark-text-sub);
  margin-top: 0.5rem;
  white-space: pre-line;
`;
