import { useLoaderData } from '@remix-run/react';
import styled from 'styled-components';

import BasicHeader from '~/components/section/basic-header';
import { formatDate } from '~/utils/date';

import NoticeTitle from './notice-title';
import type { LoaderData } from './server';

export { loader, meta } from './server';

const NoticeDetail = () => {
  const { notice } = useLoaderData() as unknown as LoaderData;

  return (
    <Wrapper>
      <BasicHeader>NOTICE</BasicHeader>
      <NoticeTitle
        title={notice.title}
        date={formatDate(notice.createdAt)}
      />
      <Content>
        {notice.content}
      </Content>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
`;

const Content = styled.p`
  margin: 1.5rem 1.25rem;
  color: var(--font-color);
  font-size: 1rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.375rem;
  white-space: pre-wrap;
`;

export default NoticeDetail;
