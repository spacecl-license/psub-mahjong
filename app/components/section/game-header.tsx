import React from 'react';
import styled from 'styled-components';

interface GameHeaderProps {
  children: React.ReactNode;
  border?: boolean;
}

const GameHeader : React.FC<GameHeaderProps> = ({ children, border }) => {

  return (
    <Wrapper border={border}>{children}</Wrapper>
  );
};

const Wrapper = styled.div<{border? : boolean}>`
  display: flex;
  width: 13rem;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  color: white;
  font-family: "Noto Sans SC";
  background: var(--Game-gold, linear-gradient(90deg, #8F6B29 0%, #FDE08D 50%, #DF9F28 100%));
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  white-space: nowrap;
  text-align: center;
  font-family: "Noto Sans SC";
  font-size: 1.125rem;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  text-transform: uppercase;
  border: ${props => props.border ? '1px solid var(--game-gold)' : 'none'};
`;

export default GameHeader;
