import styled from 'styled-components';

interface Props {
  amount: string;
  date: string;
  fromId: string;
  toId: string;
}

const Transfer = ({
  amount,
  date,
  fromId,
  toId,
}: Props) => {
  return (
    <Wrapper>
      <GroupWapper>
        <AmountGroup>
          <label>{amount}</label>
          <p>PsuB</p>
        </AmountGroup>
        <Date>{date}</Date>
      </GroupWapper>
      <GroupWapper>
        <AddressGroup>
          <label>From</label>
          <p>{fromId}</p>
        </AddressGroup>
        <AddressGroup>
          <label>To</label>
          <p>{toId}</p>
        </AddressGroup>
      </GroupWapper>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  padding: 1.5rem 1.25rem;
  border-bottom: 1px solid var(--border-bottom-color);
  background-color: var(--reward-bg2);
`;

const GroupWapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  :last-child {
    margin-top: 1rem;
  }
`;

const AmountGroup = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.25rem;

  & > label {
    color : var(--font-color);
    font-size: 1rem;
    font-style: normal;
    font-weight: 700;
    line-height: 1rem;
    text-transform: uppercase;
  }

  & > p {
    color: var(--input-dark-sub2);
    font-size: 0.875rem;
    font-style: normal;
    font-weight: 400;
    line-height: 1rem;
  }
`;

const Date = styled.p`
  color: var(--receipt-date-color);
  text-align: right;
  font-size: 0.75rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1rem;
`;

const AddressGroup = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.31rem;

  & > label {
    color: var(--nft-font-color);
    font-size: 0.875rem;
    font-style: normal;
    font-weight: 400;
    line-height: 1rem;
  }

  & > p {
    color: var(--font-color);
    font-size: 0.875rem;
    font-style: normal;
    font-weight: 400;
    line-height: 1rem;
  }
`;

export default Transfer;
