import { Link, useFetcher, useLoaderData } from '@remix-run/react';
import {
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import styled from 'styled-components';

import BasicHeader from '~/components/section/basic-header';
import useObserver from '~/hooks/use-observer';
import type NoticeModel from '~/models/notice';
import { formatDate } from '~/utils/date';

import type { loader, NoticesActionData } from '../api.notices';
import NoticeItem from './notice-item';

export { loader } from './server';

const Notice = () => {
  const { notices } = useLoaderData<typeof loader>();

  const [noticesState, setNoticesState] = useState<NoticeModel[]>(notices);
  const deferredNotices = useDeferredValue(noticesState);

  const page = useRef(1);

  const nextFetcher = useFetcher();

  // * 다음 공지사항 리스트 불러오기
  const fetchNext = useCallback(() => {
    page.current = page.current + 1;

    nextFetcher.submit({
      body: JSON.stringify({
        page: page.current,
      }),
    }, {
      method: 'post',
      action: '/api/notices',
    });
  }, [page]);

  // * nextFetcher 사이드 이펙트 (set notices)
  useEffect(() => {
    const data = nextFetcher.data as NoticesActionData;

    if (nextFetcher.state === 'idle' && data?.notices.length > 0) {
      setNoticesState(current => [...current, ...data.notices]);
    }
  }, [nextFetcher]);

  // * 공지시항 리스트 아이템
  const NoticeItems = useMemo(() => {
    return deferredNotices.map((notice, i) => {
      return (
        <Link
          to={`/my-page/notice-detail/${String(notice._id)}`}
          key={i}
        >
          <NoticeItem
            title={notice.title}
            date={formatDate(notice.createdAt)}
          />
        </Link>
      );
    });
  }, [deferredNotices]);

  // * 무한 스크롤 옵저버
  const { observerTarget } = useObserver(NoticeItems, () => {
    fetchNext();
  });

  return (
    <Wrapper>
      <BasicHeader>NOTICE</BasicHeader>
      {NoticeItems}
      <ObserverTarget ref={observerTarget} />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
`;

const ObserverTarget = styled.div`
  position: relative;
  bottom: calc(10rem);
`;

export default Notice;
