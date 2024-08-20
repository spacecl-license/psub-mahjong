import { useFetcher, useLoaderData } from '@remix-run/react';
import { useState } from 'react';
import styled from 'styled-components';

import BasicButton from '~/components/button/basic-button';

import type { loader } from './server';

export { action, loader, meta } from './server';

export default function Test() {
  const { notices } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();

  // * 작성용 상태값
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // * 수정용 상태값
  const [updateNoticeId, setUpdateNoticeId] = useState('');
  const [updateTitle, setUpdateTitle] = useState('');
  const [updateContent, setUpdateContent] = useState('');

  // * 삭제용 상태값
  const [deleteNoticeId, setDeleteNoticeId] = useState('');

  // * 공지사항 작성
  const createNotice = () => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);

    fetcher.submit(formData, {
      method: 'POST',
    });
  };

  // * 공지사항 수정
  const updateNotice = () => {
    const formData = new FormData();
    formData.append('_id', updateNoticeId);
    formData.append('title', updateTitle);
    formData.append('content', updateContent);

    fetcher.submit(formData, {
      method: 'PUT',
    });
  };

  // * 공지사항 삭제
  const deleteNotice = () => {
    if (confirm('정말로 삭제하시겠습니까?')) {
      const formData = new FormData();
      formData.append('_id', deleteNoticeId);

      fetcher.submit(formData, {
        method: 'DELETE',
      });
    }
  };

  return (
    <Wrapper>
      <NoticeList>
        <h2>공지사항 목록 (최신순)</h2>
        {!notices.length ? (
          <p>등록된 공지사항이 없습니다.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>id</th>
                <th>제목</th>
              </tr>
            </thead>
            <tbody>
              {notices.map((notice: any) => (
                <tr key={notice._id}>
                  <td>{notice._id}</td>
                  <td>{notice.title}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </NoticeList>
      <hr />
      <NoticeForm>
        <h2>공지사항 작성</h2>
        <div>
          <label htmlFor="title">제목</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="content">내용</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <BasicButton onClick={createNotice}>
          공지사항 작성
        </BasicButton>
      </NoticeForm>
      <hr />
      <NoticeForm>
        <h2>공지사항 수정</h2>
        <div>
          <label htmlFor="updateNoticeId">공지사항 ID</label>
          <input
            id="updateNoticeId"
            type="text"
            value={updateNoticeId}
            onChange={(e) => setUpdateNoticeId(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="updateTitle">제목</label>
          <input
            id="updateTitle"
            type="text"
            value={updateTitle}
            onChange={(e) => setUpdateTitle(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="updateContent">내용</label>
          <textarea
            id="updateContent"
            value={updateContent}
            onChange={(e) => setUpdateContent(e.target.value)}
          />
        </div>
        <BasicButton onClick={updateNotice}>
          공지사항 수정
        </BasicButton>
      </NoticeForm>
      <hr />
      <NoticeForm>
        <h2>공지사항 삭제</h2>
        <div>
          <label htmlFor="deleteNoticeId">공지사항 ID</label>
          <input
            id="deleteNoticeId"
            type="text"
            value={deleteNoticeId}
            onChange={(e) => setDeleteNoticeId(e.target.value)}
          />
        </div>
        <BasicButton onClick={deleteNotice}>
          공지사항 삭제
        </BasicButton>
      </NoticeForm>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100vw;
  padding: 1rem 0.5rem;
`;

const NoticeList = styled.div`
  width: 100%;
  padding: 1rem 0.75rem;

  & > h2 {
    font-size: 1.25rem;
    font-weight: 700;
  }

  & > p {
    margin-top: 1rem;
    text-align: center;
    font-weight: 700;
    color: #ececec;
  }

  & > table {
    width: inherit;
    margin-top: 1rem;

    & > thead {
      font-weight: 700;
      font-size: 1.2rem;
      border-bottom: 1px solid black;
    }

    & > tbody {
      font-weight: 400;
      font-size: 1rem;

      & > tr {
        border-bottom: 1px solid black;

        :hover {
          background-color: #f0f0f0;
        }
      }
    }
  }
`;

const NoticeForm = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem 0.75rem;

  & > h2 {
    font-size: 1.25rem;
    font-weight: 700;
  }
  
  & > div {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    & > input, & > textarea {
      border: 1px solid black;
      background-color: white;
      color: black;
    }
  }
`;
