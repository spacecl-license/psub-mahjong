import clsx from 'clsx';
import React from 'react';
import styled from 'styled-components';

interface BasicInputProps {
  label: string;
  children: React.ReactNode;
  center?: boolean;
}

const BasicInput: React.FC<BasicInputProps> = ({
  label, children, center,
}) => {
  return (
    <Section
      className={clsx(['primary'])}
    >
      <Label center={center}>{label}</Label>
      <ContentWrapper>
        {children}
      </ContentWrapper>
    </Section>
  );
};

export default BasicInput;

const Section = styled.div`
  position: relative;
  /* border: 1px solid var(--main-color); */
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1rem;
  width: 100%; 
  text-align: center;
`;

interface LabelProps {
  center?: boolean;
}

const Label = styled.span<LabelProps>`
  position: absolute;
  left: ${({ center }) => (center ? '50%' : '0.625rem')};
  top: -0.475rem;
  background-color: var(--bg-color);
  color: var(--input-dark-sub);
  font-size: 1rem;
  padding: 0 0.3125rem;
  transform: ${({ center }) => (center ? 'translateX(-50%)' : 'none')};
  font-family: Montserrat;
`;

const ContentWrapper = styled.div` 
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;
