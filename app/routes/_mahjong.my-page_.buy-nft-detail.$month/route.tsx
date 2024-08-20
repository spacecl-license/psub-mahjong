import { useFetcher, useLoaderData, useNavigate } from '@remix-run/react';
import clsx from 'clsx';
import { formatEther } from 'ethers/lib/utils';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { TOKEN } from '~/common/constants';
import BasicButton from '~/components/button/basic-button';
import SettingModal from '~/components/modal/setting-modal';
import BasicHeader from '~/components/section/basic-header';
import { toComma } from '~/utils/utils';

// import LoadingDots from '~/components/items/loading';
// import PurchaseModal from './purchase-modal';
import type { loader } from './server';

export { action, loader, meta } from './server';

const NftDetail = () => {
  const {
    nft, psubBalance, userAddress, userTransactionPassword,
  } = useLoaderData<typeof loader>();
  const [settingModal, setSettingModal] = useState(false);

  const navigate = useNavigate();

  const handleModalClose = () => {
    setSettingModal(false);
    navigate('/my-page/setting');
  };

  useEffect(() => {
    if (!userAddress || !userTransactionPassword) {
      setSettingModal(true);
    }
  }, [userAddress, userTransactionPassword]);

  const { t } = useTranslation('buy-nft');
  // const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  // const [isLoading, setIsLoading] = useState(false);

  // const emailCodeFetcher = useFetcher();

  // const purchaseModalToggle = () => {
  //   setIsPurchaseModalOpen(!isPurchaseModalOpen);
  // };

  const fetcher = useFetcher();

  // * 구매 인보이스 생성
  const purchase = () => {
    // setIsLoading(true);

    fetcher.submit({ token: TOKEN.PSUB }, {
      method: 'PUT',
    });

    // emailCodeFetcher.submit(user, {
    //   action: '/api/purchase-check',
    //   method: 'POST',
    // });
  };

  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data) {
      // setIsLoading(false);
      if ((fetcher.data as any).error) {
        alert((fetcher.data as any).error);
      } else {
        // if (emailCodeFetcher.state === 'idle' && emailCodeFetcher.data) {
        //   setIsLoading(false);

        //   if (!(emailCodeFetcher.data as any).error) {
        //     setIsPurchaseModalOpen(true);
        //   } else {
        //     alert((emailCodeFetcher.data as any).error);
        //   }
        // }
        alert('purchase success');
      }
    }
  }, [fetcher]);

  return (
    <>
      <BasicHeader>
        BUY NFT
      </BasicHeader>
      <Wrapper>
        <Header>
          <NftInformation>
            <div>
              <img
                src={nft.imageUrl}
                alt="Reward"
              />
              <div
                className={clsx(['small-info-border'])}
              >
                <div
                  className={clsx(['small-info'])}
                >
                  NFT INFO
                </div>
                <div>
                  <div>
                    <ContentHeader>NAME</ContentHeader>
                    <Content>
                      {nft.name}
                    </Content>
                  </div>
                  <div>
                    <ContentHeader>PRICE</ContentHeader>
                    <Content>
                      {`${nft.price[TOKEN.PSUB]} ${TOKEN.PSUB}`}
                    </Content>
                  </div>
                </div>
              </div>
            </div>
          </NftInformation>
        </Header>
        <BalanceWrapper>
          {`The available quantity is ${toComma(formatEther(psubBalance))} PSUB`}
        </BalanceWrapper>
        <ButtonWrapper>
          <BasicButton onClick={purchase}>
            {t('提交')}
          </BasicButton>
        </ButtonWrapper>
        {/* <PurchaseModal
        isModalOpen={isPurchaseModalOpen}
        toggleModal={purchaseModalToggle}
      /> */}
        {/* {isLoading && <LoadingDots />} */}
        <SettingModal
          isModalOpen={settingModal}
          toggleModal={handleModalClose}
          headerContent={t('无')}
          content={t('钱包地址或交易密码未登记。请检查您的登记状态并重试。')}
          buttonContent="SETTING"
        />
      </Wrapper>
    </>
  );
};

const Wrapper = styled.div`
  width: 100%;
  padding: 1.25rem;
`;

const Header = styled.div`
  display: flex;
  align-items: stretch; 
  justify-content: space-between;
`;

const NftInformation = styled.div`
  width: 100%;
  
  & > div:first-child {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1.5rem;
    margin-bottom: 2.5rem;

    & > img {
      width: 7.875rem;
      height: 14rem;
      flex-shrink: 0;
    }

    & > div {
      display: flex;
      flex-direction: column;
      flex: 1;
      height: 14rem;
      overflow: hidden;


      & > div:first-child {
        display: flex;
        height: 2.5rem;
        justify-content: center;
        align-items: center;
        color: white;
      }

      & > div:last-child {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        padding: 1rem;
        height: 11.5rem;
      }
    }
  }

  & > div:last-child {
    margin-bottom: 0;

    & > span {
      top : -0.675rem;
    }
  }
`;

const ContentHeader = styled.div`
  color: var(--event-color);
  font-family: Montserrat;
  font-size: 1rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1rem;
  text-transform: uppercase;
`;

const Content = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  color: var(--font-color);
  font-family: "Noto Sans SC";
  font-size: 1.125rem;
  font-style: normal;
  font-weight: 500;
  line-height: 2rem; 

  & > span {
    color: #555;
    font-family: "Noto Sans SC";
    font-size: 1rem;
    font-style: normal;
    font-weight: 400;
    line-height: 2rem; 
    margin-left: 0.3rem;  
  }
`;

const BalanceWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2.5rem;
  color: #AAA;
  text-align: right;
  font-family: "Noto Sans";
  font-size: 0.75rem;
  font-style: normal;
  font-weight: 400;
  line-height: 0.75rem;
`;

const ButtonWrapper = styled.div`
  margin-top: 1rem;
  display: flex;
  justify-content: center;
`;

export default NftDetail;
