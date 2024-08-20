import { useLoaderData } from '@remix-run/react';
import { useState } from 'react';
import styled from 'styled-components';

import { A, Q } from '~/components/icons';
import SvgClose from '~/components/icons/close';
import BasicHeader from '~/components/section/basic-header';
import { formatDate } from '~/utils/date';

import InquiryTitle from './inquiry-title';
import type { loader } from './server';

export { loader, meta } from './server';

const InquiryDetail = () => {
  const { inquiry } = useLoaderData<typeof loader>();
  const [showImage, setShowImage] = useState(false);

  const toggleImageModal = () => setShowImage(!showImage);

  return (
    <Wrapper>
      <BasicHeader>MY INQUIRY DETAILS</BasicHeader>
      <InquiryTitle
        title={inquiry.title}
        date={formatDate(inquiry.createdAt)}
        status={inquiry.status}
      />
      <QuationWrapper>
        <Q />
        <Content>
          {inquiry.content}
        </Content>
        {inquiry.image && (
          <ImageWrapper>
            ATTACHED PICTURES
            <img
              src={inquiry.image}
              alt="attached"
              onClick={toggleImageModal}
            />
          </ImageWrapper>
        )}
      </QuationWrapper>
      <AnswerWrapper>
        <A />
        <Content>
          {inquiry.reply}
        </Content>
      </AnswerWrapper>
      {showImage && (
        <ImageModal onClick={toggleImageModal}>
          <img
            src={inquiry.image}
            alt="Full screen"
          />
          <CloseButton onClick={toggleImageModal}><SvgClose /></CloseButton>
        </ImageModal>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
`;

const QuationWrapper = styled.p`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border-bottom: 1px solid var(--Gray-Gray4, #CCC);
  padding: 1.5rem 1.25rem;

  & > svg {
    width: 2rem;
    height: 2rem;

    & > path {
      fill: var(--input-dark-sub2);
    }
  }
`;

const Content = styled.div`
  width: 100%;
  color: var(--font-color);
  font-family: "Noto Sans SC";
  font-size: 1rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.375rem; 
  white-space: pre-wrap;
`;

const ImageWrapper = styled.div`
  display: flex;
  width: 100%;
  gap: 1rem;
  align-self: stretch;
  flex-direction: column;
  align-items: flex-start;
  border-radius: 0.5rem;
  background: var(--inquiry-image-background); 
  padding: 1rem;
  color: var(--dark-text-sub2);
  font-family: "Noto Sans SC";
  font-size: 1rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1rem; 

  & > img {
    width: 5rem;
    height: 5rem;
    border-radius: 0.5rem;
  }
`;

const AnswerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  padding: 1.5rem 1.25rem;

  & > svg {
    width: 2rem;
    height: 2rem;

    & > path {
      fill: var(--input-dark-sub2);
    }
  }
`;

const ImageModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--Black-1, #121212);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;

  img {
    width: 100%;
    height: auto;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  left: 1rem;
  background-color: var(--Black-1, #121212);

  & > svg {
    width: 2rem;
    height: 2rem;

   & > path {
      fill: var(--White-1, #FFF);
    }
  }
`;

export default InquiryDetail;
