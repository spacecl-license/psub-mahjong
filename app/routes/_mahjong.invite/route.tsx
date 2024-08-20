import { useLoaderData } from '@remix-run/react';
import download from 'downloadjs';
import * as htmlToImage from 'html-to-image';
import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { QRCode } from 'react-qrcode-logo';
import styled from 'styled-components';

import { REFERER_STATUS } from '~/common/constants';
import BasicButton from '~/components/button/basic-button';
import BasicInput from '~/components/input/basic-input';
import CopyInput from '~/components/input/copy-input';

import type { loader } from './server';
import Uninvited from './uninvited';

export { loader } from './server';

const Invite = () => {
  const { userReferral } = useLoaderData<typeof loader>();

  const QRcodeRef = useRef<HTMLDivElement>(null);

  const captureAndDownloadImage = async () => {
    if (QRcodeRef.current) {
      let dataUrl = '';
      const minDataLength = 2000000; // 최소 데이터 길이 설정
      let attempts = 0; // 시도 횟수 카운터
      const maxAttempts = 10; // 최대 시도 횟수

      while (dataUrl.length < minDataLength && attempts < maxAttempts) {
        dataUrl = await htmlToImage.toJpeg(QRcodeRef.current, {
          skipFonts: true,
          fontEmbedCSS: '',
        });
        attempts += 1; // 시도 횟수 증가
      }

      // 이미지 데이터를 다운로드
      download(dataUrl, 'invite-code.png');
    }
  };

  const { t } = useTranslation('invite');

  return (
    <>
      <HeaderText>
        <h1>
          {t('邀请朋友和会员！')}
        </h1>
        {t('邀请的朋友越多、 奖励就越丰厚！')}
      </HeaderText>
      {userReferral?.status === REFERER_STATUS.DISABLED ? (<Uninvited />) :
        (
          <Container>
            <CopyInput
              label={t('转介代码')}
              content={userReferral?.referralCode ?? ''}
            />
            <BasicInput label={t('转介代码 QR')}>
              <div ref={QRcodeRef}>
                <QRCode
                  value={`https://www.psubgaminghub.com/regist?referralCode=${userReferral?.referralCode ?? ''}`}
                  size={250}
                />
              </div>
              <BasicButton onClick={captureAndDownloadImage}>
                DOWNLOAD
              </BasicButton>
            </BasicInput>
          </Container>
        )}
    </>
  );
};

export default Invite;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding : 0rem 1.25rem 4rem 1.25rem;
  gap: 2rem;

  & > div:last-child > div {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;

    & > button {
      margin: 0;
    }
  }
`;

const HeaderText = styled.div`
  width: 100%;
  height: 7.75rem;
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
  margin-bottom: 2rem;
  white-space: pre-line;
  color: white;
  padding: 1.5rem 1.25rem;

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
