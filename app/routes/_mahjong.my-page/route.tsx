import { Link } from '@remix-run/react';
import { useTranslation } from 'react-i18next';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';

import BasicButton from '~/components/button/basic-button';
import SvgArrowRedo from '~/components/icons/arrow-redo';
import SvgCsCenter from '~/components/icons/cs-center';
import SvgFriend from '~/components/icons/friend';
import SvgGift from '~/components/icons/gift';
import SvgHistory from '~/components/icons/history';
import SvgNft from '~/components/icons/nft';
import SvgNotice from '~/components/icons/notice';
import SvgOrganization from '~/components/icons/organization';
import SvgWallet from '~/components/icons/wallet';
import BasicInput from '~/components/input/basic-input';
import UserProfile from '~/components/items/profile';
import { userReferralState, userState } from '~/recoil/atoms';

const MyPage = () => {
  const { t } = useTranslation('my-page');
  const user = useRecoilValue(userState);
  const userReferral = useRecoilValue(userReferralState);

  return (
    <div>
      <UserProfile
        user={user!}
        userReferral={userReferral!}
      />
      <InputWrapper>
        <BasicInput
          label="MENU"
          center
        >
          <div>
            <Content>
              <Link to="/my-page/my-reward">
                <SvgGift />
                <div>{t('奖励')}</div>
              </Link>
            </Content>
            <Content>
              <Link to="/my-page/my-wallet">
                <SvgWallet />
                <div>{t('钱包')}</div>
              </Link>
            </Content>
            <Content>
              <Link to="/my-page/friend">
                <SvgFriend />
                <div>{t('我的好友')}</div>
              </Link>
            </Content>
          </div>
          <div>
            <Content>
              <Link to="/my-page/buy-nft">
                <SvgNft />
                <div>{t('NFT 购买')}</div>
              </Link>
            </Content>
            <Content>
              <Link to="/my-page/receipt">
                <SvgHistory />
                <div>{t('记录')}</div>
              </Link>
            </Content>
            <Content>
              <Link to="/my-page/notice">
                <SvgNotice />
                <div>{t('通知')}</div>
              </Link>
            </Content>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              gap: '1.4rem',
            }}
          >
            <Content>
              <Link to="/my-page/cs-center">
                <SvgCsCenter />
                <div>CS CENTER</div>
              </Link>
            </Content>
            <Content>
              <Link to="/chart">
                <SvgOrganization />
                <div>P-AMILY</div>
              </Link>
            </Content>
          </div>
        </BasicInput>
      </InputWrapper>
      <ButtonWrapper>
        <a
          href="https://play.google.com/store/search?q=mexc&c=apps&hl=ko-KR"
          target="_blank"
          rel="noreferrer"
        >
          <BasicButton
            variant="link"
          >
            <div>
              MEXC DOWNLOAD
            </div>
            <SvgArrowRedo />
          </BasicButton>
        </a>
        <a
          href="https://play.google.com/store/apps/details?id=com.gateio.gateio&hl=ko-KR"
          target="_blank"
          rel="noreferrer"
        >
          <BasicButton
            variant="link"
          >
            <div>
              GATEIO DOWNLOAD
            </div>
            <SvgArrowRedo />
          </BasicButton>
        </a>
        <a
          href="https://play.google.com/store/apps/details?id=vip.mytokenpocket&hl=ko-KR"
          target="_blank"
          rel="noreferrer"
        >
          <BasicButton
            variant="link"
          >
            <div>
              TPPOKET DOWNLOAD
            </div>
            <SvgArrowRedo />
          </BasicButton>
        </a>
        <a
          href="https://klayswap.com/exchange/swap"
          target="_blank"
          rel="noreferrer"
        >
          <BasicButton
            variant="link"
          >
            <div>
              KLAYSWAP(DEX)
            </div>
            <SvgArrowRedo />
          </BasicButton>
        </a>
      </ButtonWrapper>
    </div>
  );
};

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2.5rem 1.25rem 0 1.25rem;

  & > div > div {
    flex-direction: column;
    gap: 1.7rem;
  }

  & > div > div > div {
    display: flex;
    width: 100%;
    justify-content: space-between;
    padding: 0.3125rem 0;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 2.5rem;
  padding : 0 1.25rem;

  & > a {
    width: 100%;
    &  > button {
      & > div {
        display: flex;
        justify-content: center;
        align-items: center;
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

const Content = styled.div`
  flex: 0 1 calc(33.33% - 1rem);
  box-sizing: border-box;

  & > a > div {
    color: var(--input-dark-sub);
    font-family: "Noto Sans";
    font-size: 1rem;
    font-style: normal;
    font-weight: 400;
    line-height: 1.375rem; 
    white-space: nowrap;
  }

  & > a {
    text-decoration: none ;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
  }

  svg {
    width: 2.85713rem;
    height: 2.85713rem;
    path {
      fill: var(--input-dark-sub2);
    }
  }
`;

export default MyPage;
