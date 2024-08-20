import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import InquiryBadge from '~/components/badge/inquiry-badge';
import { Arrow } from '~/components/icons';

interface Props {
  title: string;
  date: string;
  status: string;
}

const InquiryItem = ({
  title,
  date,
  status,
}: Props) => {

  const { t } = useTranslation('inquiry');

  return (
    <Wrapper>
      <GroupWapper>
        <TitleGroup>
          <TitleTop>
            <InquiryBadge disabled={status === 'inquiry'}>
              {status === 'inquiry' ? t('受理') : t('答复完毕')}
            </InquiryBadge>
            <p>{date}</p>
          </TitleTop>
          <label>{title}</label>
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
`;

const GroupWapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

`;

const TitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 0.5rem;
  flex: 1;
  margin-right: 1rem;

  & > label {
    overflow: hidden;
    text-overflow: ellipsis;
    color: var(--font-color);
    font-size: 1rem;
    font-style: normal;
    font-weight: 700;
    line-height: 1.25rem;
    text-transform: uppercase;
  }


`;

const TitleTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;

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

export default InquiryItem;
