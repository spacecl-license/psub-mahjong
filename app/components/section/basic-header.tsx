import React from 'react';
import styled from 'styled-components';

interface BasicHeaderProps {
  children: React.ReactNode;
}

const BasicHeader : React.FC<BasicHeaderProps> = ({ children }) => {

  return (
    <Wrapper>{children}</Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.25rem;
  color: white;
  font-family: Montserrat;
  background-color: var(--header-information);
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.25rem; 
`;

export default BasicHeader;
