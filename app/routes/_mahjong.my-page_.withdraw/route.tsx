import { useFetcher, useLoaderData, useNavigate } from '@remix-run/react';
import { BigNumber } from 'ethers';
import { formatEther, parseEther } from 'ethers/lib/utils';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import BasicButton from '~/components/button/basic-button';
import SvgWallet from '~/components/icons/wallet';
import SvgWithdraw from '~/components/icons/withdraw';
import BasicInput from '~/components/input/basic-input';
// import EmailVerify from '~/components/input/email-verify';
import PsubInput from '~/components/input/psub-input';
import QuantityInput from '~/components/input/quantity-input';
import TransactionInput from '~/components/input/transaction-input';
import LoadingDots from '~/components/items/loading';
import SettingModal from '~/components/modal/setting-modal';
import WithdrawalModal from '~/components/modal/withdrawal-modal';
import BasicHeader from '~/components/section/basic-header';
import BasicSection from '~/components/section/basic-section';
import { formatWalletAddress } from '~/hooks/wallet-slice';

import type { loader } from './server';

export { action, loader, meta } from './server';

const Withdraw = () => {
  const {
    userAddress, psubBalance, coinPrice, userTransactionPassword,
  } = useLoaderData<typeof loader>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fetcher = useFetcher();
  const emailCodeFetcher = useFetcher();

  const { t } = useTranslation('my-wallet');
  const [quantity, setQuantity] = useState('0');
  // const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [transactionPassword, setTransactionPassword] = useState('');

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

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const receive = useMemo(() => {
    if (parseFloat(quantity) > 0) {
      const amount = BigNumber.from(parseEther(quantity));
      const fee = amount.div(20);
      return formatEther(amount.sub(fee));
    }
    return '0';
  }, [quantity]);

  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data) {
      setIsLoading(false);

      if ((fetcher.data as any).error) {
        alert((fetcher.data as any).error);
      } else {
        console.info('receipt', fetcher.data);
        setIsModalOpen(true);
      }
    }
  }, [fetcher]);

  const reqWithdraw = () => {
    setIsLoading(true);
    fetcher.submit({ quantity, transactionPassword }, { method: 'POST' });
  };

  // const onVerifyClick = () => {
  //   setIsLoading(true);

  //   emailCodeFetcher.submit({ }, {
  //     action: '/api/send-withdraw-email',
  //     method: 'POST',
  //   });
  // };

  useEffect(() => {
    if (emailCodeFetcher.state === 'idle' && emailCodeFetcher.data) {
      setIsLoading(false);

      if (!(emailCodeFetcher.data as any).error) {
        alert('email code sended.');
      } else {
        alert((emailCodeFetcher.data as any).error);
      }
    }
  }, [emailCodeFetcher]);

  return (
    <Wrapper>
      <BasicHeader>{t('提款')}</BasicHeader>
      <FirstSection>
        <BasicInput label={t('PSUB地址')}>
          <SvgWallet />
          {formatWalletAddress(userAddress.psubAddress)}
        </BasicInput>
        <QuantityInput
          label={t('提款数量')}
          currency="PsuB"
          spanContent={`${t('可提款')} : ${formatEther(psubBalance)} PsuB`}
          icon={SvgWithdraw}
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
        {/* <InfoWrapper>
          <div>{t('提现已申请，预计最长60分钟内到账。请稍等，感谢。')}</div>
          <div>
            {` ＊ 提现已提交申请，
            请勿重复提现，慎重！！ 慎重！！
            重复提现导致不到账，后果自负。＊`}
          </div>
        </InfoWrapper> */}
      </FirstSection>
      <BasicSection
        commission
        headerContent={t('实际收到数量')}
      >
        <RequestWrapper>
          <PsubInput
            value={receive}
            label={t('实际取款数量')}
            usdEquivalent={parseFloat((coinPrice.USD * parseFloat(receive)).toFixed(2))}
            yenEquivalent={parseFloat((coinPrice.CNY * parseFloat(receive)).toFixed(2))}
          />
          <TransactionInput
            type="text"
            name="transactionPassword"
            value={transactionPassword}
            onChange={(e) => setTransactionPassword(e.target.value)}
          />
          <BasicButton
            onClick={reqWithdraw}
            disabled={isLoading}
          >
            {t('提现')}
          </BasicButton>
        </RequestWrapper>
      </BasicSection>
      {isLoading && <LoadingDots />}
      <SettingModal
        isModalOpen={settingModal}
        toggleModal={handleModalClose}
        headerContent={t('无')}
        content={t('钱包地址或交易密码未登记。请检查您的登记状态并重试。')}
        buttonContent="SETTING"
      />
      <WithdrawalModal
        isModalOpen={isModalOpen}
        toggleModal={toggleModal}
        headerContent={t('完成_')}
      />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
`;

const FirstSection = styled.div`
  width: 100%;
  padding: 2rem 1.25rem 0 1.25rem;
  display: flex;
  gap: 1.5rem;
  flex-direction: column;
  align-items: center;
 & > div:first-child > div {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: var(--content-color);
    text-align: right;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-family: "Noto Sans SC";
    font-size: 1.125rem;
    font-style: normal;
    font-weight: 500;
    line-height: 2rem; 

    & > svg {
      width: 2rem;
      height: 2rem;
      path {
        fill: var(--input-dark-sub2);
      }
    }
 }

 & > div:nth-child(2) > div {
    padding: 1rem;
    display: flex;
    align-items: center;

    & > div > svg {
      width: 2rem;
      height: 2rem;
      path {
        fill: var(--input-dark-sub2);
      }
    }

    & > div > div > span {
      text-align: right;
      font-family: "Noto Sans";
      font-size: 1rem;
      font-style: normal;
      font-weight: 400;
      line-height: 2rem; 
    }
 }
`;

const RequestWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 1.25rem;
  margin-bottom : 2rem;
`;

// const InfoWrapper = styled.div`
//   display: flex;
//   flex-direction: column;
//   gap: 1.5rem;
//   align-items: flex-start;
//   width: 100%;

//   & > div:first-child {
//     font-family: "Noto Sans SC";
//     font-size: 0.875rem;
//     font-style: normal;
//     font-weight: 400;
//     line-height: 1.375rem;
//     text-align: left;
//     color: var(--content-color);
//     white-space: pre-line;

//   }

//   & > div:last-child {
//     font-family: "Noto Sans SC";
//     font-size: 1rem;
//     font-style: normal;
//     font-weight: 400;
//     line-height: 1.5rem;
//     color: var(--input-dark-sub2);
//     white-space: pre-line;
//   }
// `;

export default Withdraw;
