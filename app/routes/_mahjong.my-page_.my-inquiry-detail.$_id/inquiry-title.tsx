import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import InquiryBadge from '~/components/badge/inquiry-badge';

interface Props {
  title: string;
  date: string;
  status: string;
}

const InquiryTitle = ({
  title,
  date,
  status,
}: Props) => {
  const { t } = useTranslation('inquiry');
  return (
    <Wrapper>
      <GroupWapper>
        <TitleGroup>
          <label>{title}</label>
          <TitleBottom>
            <p>{date}</p>
            <InquiryBadge disabled={status === 'inquiry'}>
              {status === 'inquiry' ? t('受理') : t('答复完毕')}
            </InquiryBadge>
          </TitleBottom>
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
  width: 100%;
`;

const TitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 0.5rem;
  width: 100%;

  & > label {
    color: var(--font-color);
    font-size: 1rem;
    font-style: normal;
    font-weight: 700;
    line-height: 1.25rem;
    text-transform: uppercase;
  }
`;

const TitleBottom = styled.div`
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

export default InquiryTitle;
