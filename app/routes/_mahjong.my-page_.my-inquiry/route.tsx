import { Link, useLoaderData } from '@remix-run/react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import BasicHeader from '~/components/section/basic-header';
import { formatDate } from '~/utils/date';

import InquiryItem from './inquiry-item';
import type { loader } from './server';

export { loader } from './server';

const Inquiry = () => {
  const { inquiries } = useLoaderData<typeof loader>();
  const { t } = useTranslation('inquiry');

  const InquiryItems = useMemo(() => inquiries.map((inquiry: any, i: number) => {
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, status: string) => {
      if (status === 'inquiry') {
        e.preventDefault();
      }
    };

    return (
      <Link
        to={`/my-page/my-inquiry-detail/${inquiry._id}`}
        key={inquiry._id}
        onClick={(e) => handleClick(e, inquiry.status)}
      >
        <InquiryItem
          title={inquiry.title}
          date={formatDate(inquiry.createdAt)}
          status={inquiry.status}
        />
      </Link>
    );
  }), [inquiries]);

  return (
    <Wrapper>
      <BasicHeader>MY INQUIRY DETAILS</BasicHeader>
      <Title>
        {t('详细信息只对回答完毕的咨询提供。')}
      </Title>
      {InquiryItems}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
`;

const Title = styled.div`
  width: 100%;
  padding: 1.5rem 1.25rem;
  cursor: pointer;
  border-bottom: 1px solid var(--border-bottom-color);
  color: var(--content-color);
  text-align: center;
  font-family: "Noto Sans SC" !important;
  font-size: 1rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.375rem; 
`;

export default Inquiry;
