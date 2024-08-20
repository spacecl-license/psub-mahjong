// import { useFetcher, useLoaderData } from '@remix-run/react';
import { Link } from '@remix-run/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import BasicButton from '~/components/button/basic-button';
import SvgArrowRedo from '~/components/icons/arrow-redo';
import SvgPsub from '~/components/icons/psub';
import BasicInput from '~/components/input/basic-input';
// import MainModal from '~/components/modal/main-modal';

// import type { loader } from './server';

export { loader } from './server';

const MainPage: React.FC = () => {
  const { t } = useTranslation('home');

  // const modalFetcher : any = useFetcher();

  // const { modalOpen } = useLoaderData<typeof loader>();

  // const handleModal = () => {
  //   modalFetcher.submit(null, { method: 'post', action: '/api/modal-close' });
  // };

  return (
    <>
      <VideoSection>
        <video
          src="/videos/psub-video.mp4"
          autoPlay
          muted
          loop
        />
      </VideoSection>
      <VideoText>
        <h1>{t('HANAFUDA 收集游戏')}</h1>
        {t('提升等级，赚取更多奖励。与会员联系，提升等级！达到最高级别，获得特殊奖励')}
      </VideoText>
      <PageContainer>
        <TextSection>
          <BasicInput label="PSUB?">
            <div>
              <SvgPsub />
              <div>
                {t('首个 \'玩转 NFT\' 整体平台项目。')}
              </div>
            </div>
            <div>
              {t('PsuB 在 NFT 生态系统中展示了令人难以置信的可扩展性。它作为一个活跃的 NFT 应用中心，不仅限于艺术、PFP 和音乐，已经赢得了人们的关注。现在，您可以通过 PsuB 平台体验世界上最通用的 NFT 生态系统。')}
            </div>
          </BasicInput>
        </TextSection>
        <Link to="/game-hub">
          <BasicButton variant="link">
            <div>
              <SvgPsub />
              RANDOMBOX BATTLE
            </div>
            <SvgArrowRedo />
          </BasicButton>
        </Link>
        <a
          href="https://psub.io/"
          target="_blank"
          rel="noreferrer"
        >
          <BasicButton variant="link">
            <div>
              <SvgPsub />
              PSUB WEBSITE
            </div>
            <SvgArrowRedo />
          </BasicButton>
        </a>
        <a
          href="https://psubbox.com/"
          target="_blank"
          rel="noreferrer"
        >
          <BasicButton variant="link">
            <div>
              <SvgPsub />
              PSUB BOX
            </div>
            <SvgArrowRedo />
          </BasicButton>
        </a>
        <a
          href="https://psub.io/gallery.html"
          target="_blank"
          rel="noreferrer"
        >
          <BasicButton variant="link">
            <div>
              <SvgPsub />
              {t('PsuB 海报')}
            </div>
            <SvgArrowRedo />
          </BasicButton>
        </a>
      </PageContainer>
      {/* <MainModal
        isModalOpen={modalOpen}
        toggleModal={handleLogout}
      /> */}
    </>
  );
};

// 스타일드 컴포넌트 정의
const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.25rem;

  & > a {
    width: 100%;
    &  > button {
      & > div {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 0.5rem;
        color: #FFF;
        text-align: center;
        font-family: Montserrat;
        font-size: 1.125rem;
        font-style: normal;
        font-weight: 400;
        text-transform: uppercase;
      }

      justify-content: space-between;

    }

    :last-child {
        margin-bottom: 4rem;
      }
  }

 
`;

const VideoSection = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  video {
    width: 100%;
    height: auto;
  }
`;

const VideoText = styled.div`
  width: 100%;
  height: 12.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: var(--header-information);
  text-align: center;
  font-family: "Noto Sans SC";
  font-size: 1rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.375rem; 
  margin-bottom: 2.5rem;
  white-space: pre-line;
  color: white;
  padding: 2.5rem 1.25rem;

  h1 {
    color: #FFF;
    text-align: center;
    font-family: Montserrat;
    font-size: 1.125rem;
    font-style: normal;
    font-weight: 700;
    line-height: 1rem;
    text-transform: uppercase;
    margin-bottom: 1rem;
  }
`;

const TextSection = styled.div`
  width: 100%;
  margin-bottom: 2.5rem;

  & > div > div {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 1rem;

    & > div:first-child{
      display: flex;
      justify-content: flex-start;
      align-items: center;
      gap : 1.25rem;  
    
      & > svg {
        width: 4rem;
        height: 3.741rem;

        path {
          fill: var(--input-dark-sub2);
        }
      }
    
      & > div {
        font-family: "Noto Sans";
        color : var(--input-dark-sub);
        font-size: 1rem;
        font-style: normal;
        font-weight: 700;
        line-height: 1.375rem;
        text-transform: uppercase;
        white-space: pre-line;
        text-align: left;
        vertical-align: top;
      }
    }

    & > div:last-child {
      font-family: "Noto Sans SC";
      font-size: 1rem;
      font-style: normal;
      font-weight: 400;
      line-height: 1.375rem; 
      text-align: left;
      color : var(--font-color);
    }
  }
`;

export default MainPage;
