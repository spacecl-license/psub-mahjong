import styled from 'styled-components';

import { Arrow } from '~/components/icons';

interface Props {
  title: string;
  date: string;
}

const NoticeItem = ({
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
        <MoreWapper>
          <Arrow />
        </MoreWapper>
      </GroupWapper>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  padding: 1.5rem 1.25rem;
  cursor: pointer;
  border-bottom: 1px solid var(--border-bottom-color);

  &:hover {
    background-color: #ececec;
  }
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

const MoreWapper = styled.div`
  transform: rotate(-90deg);

  & > svg {
    width: 1.25rem;
    height: 1.25rem;
    path {
      fill: var(--input-dark-sub2);
    }
  }
`;

export default NoticeItem;
