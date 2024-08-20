import styled from 'styled-components';

interface ButtonProps {
  disabled?: boolean;
}

const InquiryBadge = styled.div<ButtonProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 4rem;
  padding: 0.12rem, 0.5rem;
  border-radius: 624.938rem;
  color: ${({ disabled }) => disabled ? 'var(--calendar-tap-color)' : 'var(--inquiry-badge-color)'};
  border: ${({ disabled }) => disabled ? '1px solid var(--calendar-tap-color)' : ' 1px solid var(--inquiry-badge-color)'};
  font-family: "Noto Sans SC";
  font-size: 0.625rem;
  font-style: normal;
  font-weight: 400;
  line-height: 0.75rem;
`;

export default InquiryBadge;
