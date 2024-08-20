import React from 'react';
import styled from 'styled-components';

interface ChannelItemProps {
  title: string;
  imageSrc : string;
  isActive: boolean;
  onClick: () => void;
}

const ChannelItem: React.FC<ChannelItemProps> = ({
  title, imageSrc, isActive, onClick,
}) => {
  return (
    <ItemWrapper
      isActive={isActive}
      onClick={onClick}
    >
      <ImageWrapper>
        <ItemImage
          src={imageSrc}
          alt={title}
        />
      </ImageWrapper>
      <Label isActive={isActive}>{title}</Label>
    </ItemWrapper>
  );
};

const ItemWrapper = styled.div<{isActive : boolean}>`
  background: ${({ isActive }) => isActive ? 'linear-gradient(90deg, #597CF6 0%, #613795 100%)' : 'var(--bg-color)'};
  border-radius: 9999px;
  min-width: calc((100% - 1.5rem) / 2);
  max-width: calc((100% - 1.5rem) / 2);
  padding: 1rem;
  position: relative;
  overflow: hidden; 
  display: flex;
  align-items: center;
  justify-content: flex-end;
  border: ${({ isActive }) => isActive ? '1px solid var(--game-gold)' : '1px solid #777'};
`;

const ImageWrapper = styled.div`
  transform: rotate(15deg);
  position: absolute;
  left: 1rem; 
  bottom: -0.7rem; 
`;

const ItemImage = styled.img`
  width: 2.5rem;
  height: auto;
`;

const Label = styled.span<{isActive : boolean}>`
  color: ${({ isActive }) => isActive ? 'var(--font-color)' : '#777'};
  font-family: "Noto Sans SC";
  font-size: 1.125rem;
  font-style: normal;
  font-weight: 500;
  line-height: 2rem;
  z-index: 1;
`;

export default ChannelItem;
