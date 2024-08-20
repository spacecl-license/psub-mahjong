import styled from 'styled-components';

interface Props {
  title: string;
  date: string;
}

const NoticeTitle = ({
  title,
  date,
}: Props) => {
  return (
    <Wrapper>
      <GroupWapper>
        <TitleGroup>
          <label>{title}</label>
          <p>{date}</p>
        </TitleGroup>
      </GroupWapper>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  padding: 1.5rem 1.25rem;
  border-bottom: 1px solid var(--border-bottom-color);
  cursor: pointer;
`;

const GroupWapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  :last-child {
    margin-top: 1rem;
  }
`;

const TitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 0.5rem;

  & > label {
    color: var(--font-color);
    font-size: 1rem;
    font-style: normal;
    font-weight: 700;
    line-height: 1.25rem;
    text-transform: uppercase;
  }

  & > p {
    color: var(--calendar-tap-color);
    font-size: 0.875rem;
    font-style: normal;
    font-weight: 400;
    line-height: 1rem;
  }
`;

export default NoticeTitle;
