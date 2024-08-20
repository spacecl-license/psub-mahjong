import styled from 'styled-components';

interface Props {
  label?: string;
  isConnect?: boolean;
}

const NetworkStatusBadge = ({
  label = 'KLAYTN',
  isConnect = false,
}: Props) => {
  return (
    <Wrapper>
      {isConnect ? <Connect /> : <DisConnect />}
      <Label>{label}</Label>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Connect = styled.div`
  width: 0.375rem;
  height: 0.375rem;
  background-color: #69FF97;
  border-radius: 50%;
`;

const DisConnect = styled.div`
  width: 0.375rem;
  height: 0.375rem;
  background-color: var(--main-color);
  border-radius: 50%;
`;

const Label = styled.label`
  color: var(--font-color);
  text-align: center;
  font-size: 1rem;
  font-style: normal;
  font-weight: 700;
  line-height: 1.25rem;
  text-transform: uppercase;
`;

export default NetworkStatusBadge;
