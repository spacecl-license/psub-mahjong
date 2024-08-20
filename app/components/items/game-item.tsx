import React from 'react';
import styled from 'styled-components';

import { useTheme } from '~/hooks/use-theme';

interface GameItemProps {
  isActive: boolean;
  index : number;
}

const GameItem: React.FC<GameItemProps> = ({ isActive, index }) => {
  const colors = [
    '#FF412D',
    // '#FF8E2B',
    '#FFCD5C',
    '#2ABC6E',
    '#3BA4D8',
    '#6469F8',
    '#A35CFB',
  ];

  const activeImages = [
    'active1.png',
    'active2.png',
    'active3.png',
  ];

  const inactiveImages = [
    'off1.png',
    'off2.png',
    'off3.png',
  ];

  const [theme] = useTheme();

  // const imageSrc = useMemo(() => {
  //   const images = isActive ? activeImages : inactiveImages;
  //   const randomIndex = Math.floor(Math.random() * images.length);
  //   return `/images/${images[randomIndex]}`;
  // }, []);

  // const backgroundColor = useMemo(() => {
  //   return isActive ? colors[Math.floor(Math.random() * colors.length)] : 'transparent';
  // }, []);

  const backgroundColor = isActive ? colors[index] : 'transparent';
  const imageSrc = isActive ? `/images/${activeImages[index % 3]}` : `/images/${inactiveImages[index % 3]}`;

  return (
    <ItemWrapper
      isActive={isActive}
      backgroundColor={backgroundColor}
      theme={theme}
    >
      <FrogImage
        src={imageSrc}
        alt="Game Item"
      />
    </ItemWrapper>
  );
};

const ItemWrapper = styled.div<{ isActive: boolean, backgroundColor: string, theme : string, }>`
  position: relative;
  width: calc(33.333% - 1rem); 
  padding-top: calc(33.333% - 1rem);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ backgroundColor }) => backgroundColor};
  transition: background-color 0.3s ease;
  border: ${({ isActive }) => (isActive ? '1px solid white' : '1px solid var(--gray)')};
  box-shadow: ${({ theme, backgroundColor }) => theme === 'dark' ? `0 0 15px ${backgroundColor}` : 'none'};
`;

const FrogImage = styled.img`
  position: absolute;
  width: 80%;  
  height: auto; 
  top: 50%; 
  left: 50%; 
  transform: translate(-50%, -50%); 
  border-radius: 50%; 
`;

export default GameItem;
