import React from 'react';
import styled, { keyframes } from 'styled-components';

const scaleAndChangeColor = keyframes`
  0%, 100% {
    transform: scale(0.7);
    background-color: var(--loading-color);
  }
  50% {
    transform: scale(1.0);
    background-color: var(--loading-color2);
  }
`;

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

const DotsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Dot = styled.div<{ order: number }>`
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 50%;
  background-color: var(--loading-color); 
  transform: scale(0.7);
  animation: ${scaleAndChangeColor} 2s infinite ease-in-out;
  margin: 0 5px;
  animation-delay: ${({ order }) => (order - 1) * 0.4}s;
`;

const LoadingDots: React.FC = () => {
  return (
    <LoadingOverlay>
      <DotsContainer>
        <Dot order={1} />
        <Dot order={2} />
        <Dot order={3} />
      </DotsContainer>
    </LoadingOverlay>
  );
};

export default LoadingDots;
