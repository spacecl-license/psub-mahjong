import clsx from 'clsx';
import React from 'react';
import styled from 'styled-components';

interface EventInputProps {
  label: string;
  center?: boolean;
  firstName?: string;
  secondName?: string;
  thirdName?: string;
  eventStart?: boolean;
  variant?: string;
  solo?: boolean;
}

const EventInput: React.FC<EventInputProps> = ({
  label,
  center,
  firstName,
  secondName,
  thirdName,
  eventStart,
  variant = 'event',
  solo,
}) => {
  return (
    <Section
      className={clsx([variant])}
    >
      <Label
        center={center}
        solo={solo}
      >
        {label}
      </Label>
      <ContentWrapper>
        <ImageWrapper>
          <Image
            src="/images/rank-1.png"
            eventStart={eventStart}
          />
          {firstName}
        </ImageWrapper>
        <ImageWrapper>
          <Image
            src="/images/rank-2.png"
            eventStart={eventStart}
          />
          {secondName}
        </ImageWrapper>
        <ImageWrapper>
          <Image
            src="/images/rank-3.png"
            eventStart={eventStart}
          />
          {thirdName}
        </ImageWrapper>
      </ContentWrapper>
    </Section>
  );
};

export default EventInput;

const Section = styled.div`
  position: relative;
  border-radius: 8px;
  padding: 1rem;
  width: 100%; 
  text-align: center;
`;

interface LabelProps {
  center?: boolean;
  solo? : boolean;
}

const Label = styled.span<LabelProps>`
  position: absolute;
  left: ${({ center }) => (center ? '50%' : '0.625rem')};
  top: -0.575rem;
  background-color: var(--bg-color);
  color : ${({ solo }) => (solo ? 'var(--event-color2)' : 'var(--event-color)')};
  font-size: 1rem;
  border-radius: 0.5rem;
  padding: 0 0.3125rem;
  transform: ${({ center }) => (center ? 'translateX(-50%)' : 'none')};
  font-family: Montserrat;
`;

const ContentWrapper = styled.div` 
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const ImageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.62rem;
  justify-content: center;
  align-items: center;
  color : var(--font-color);
  font-family: "Noto Sans SC" !important;
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 400;
  line-height: 0.875rem;
`;

interface ImgProps {
  eventStart?: boolean;
}

const Image = styled.img<ImgProps>`
  width: 2.5rem;
  height: 2.33813rem;
  object-fit: cover;
  filter: ${({ eventStart }) => (eventStart ? 'none' : 'grayscale(100%)')};
`;
