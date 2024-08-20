import clsx from 'clsx';
import styled from 'styled-components';

import { debounce } from '../debounce/debounce';

interface ButtonProps {
  variant? : string;
  children: React.ReactNode;
  type?: any;
  onClick?: () => void;
  disabled?: boolean;
  big?: boolean;
}

const BasicButton: React.FC<ButtonProps> = ({
  variant = 'primary',
  children,
  type = 'button',
  onClick,
  disabled,
  big,
}) => {
  const debounceOnConfirm = debounce(onClick!, 300);
  return (
    <CustomButton
      type={type}
      className={clsx([variant])}
      onClick={debounceOnConfirm}
      disabled={disabled}
      big={big}
    >
      {children}
    </CustomButton>
  );
};

const CustomButton = styled.button<{big? : boolean}>`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;
  padding: 0.625rem 1.25rem;
  border: none;
  border-radius: 624.938rem;
  width: 100%;
  font-weight: 700;
  cursor: pointer;
  font-family: Montserrat;
  font-size: ${props => (props.big ? '1.5rem' : '1rem')};
  line-height: ${props => (props.big ? '3rem' : 'none')}; 

  &:focus {
    outline: none;
  }

  &:hover {
    opacity: 0.8;
  }

  &:disabled {
    background-color: silver;
  }
`;

export default BasicButton;
