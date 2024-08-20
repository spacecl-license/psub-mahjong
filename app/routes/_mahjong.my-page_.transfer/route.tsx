import { useFetcher, useLoaderData, useNavigate } from '@remix-run/react';
import { BigNumber } from 'ethers';
import { formatEther, parseEther } from 'ethers/lib/utils';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import BasicButton from '~/components/button/basic-button';
import SvgUser from '~/components/icons/user';
import SvgWithdraw from '~/components/icons/withdraw';
import BasicInput from '~/components/input/basic-input';
import PsubInput from '~/components/input/psub-input';
import QuantityInput from '~/components/input/quantity-input';
import TransactionInput from '~/components/input/transaction-input';
import LoadingDots from '~/components/items/loading';
import FailModal from '~/components/modal/fail-modal';
import SettingModal from '~/components/modal/setting-modal';
import TransferModal from '~/components/modal/transfer-modal';
import BasicHeader from '~/components/section/basic-header';
import BasicSection from '~/components/section/basic-section';

import type { loader } from './server';

export { action, loader, meta } from './server';

const Transfer = () => {
  const {
    psubBalance, coinPrice, userAddress, userTransactionPassword,
  } = useLoaderData<typeof loader>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { t } = useTranslation('my-wallet');
  const [recipientId, setRecipientId] = useState('');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFailOpen, setIsFailOpen] = useState(false);
  const [transactionPassword, setTransactionPassword] = useState('');
  const [settingModal, setSettingModal] = useState(false);

  const fetcher : any = useFetcher();

  const psubBalanceInEther = parseFloat(formatEther(psubBalance));

  const bigAmount = useMemo(() => {
    return BigNumber.from(amount ? parseEther(amount)  : '0');
  }, [amount]);
  const fee = bigAmount.div(20).toString();
  const sendAmount = formatEther(bigAmount.sub(fee).toString());

  const handleAmountChange = (e : any) => {
    const newAmount = e.target.value;

    if (Number(newAmount) <= psubBalanceInEther) {
      setAmount(newAmount);
    }
  };

  const handleSubmit = (e : any) => {
    if (!amount || Number(amount) <= 0 || Number(amount) > psubBalanceInEther) {
      e.preventDefault();
      alert('Invalid amount.');
      return;
    }
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const navigate = useNavigate();

  const handleSettingModalClose = () => {
    setSettingModal(false);
    navigate('/my-page/setting');
  };

  useEffect(() => {
    if (!userAddress || !userTransactionPassword){
      setSettingModal(true);
    }
  }, [userAddress, userTransactionPassword]);

  useEffect(() => {
    if (fetcher.state === 'submitting') {
      setIsLoading(true);
    } else if (fetcher.state === 'idle') {
      setIsLoading(false);

      if (fetcher.data && !fetcher.data.error) {
        setIsModalOpen(true);
        setTransactionPassword('');
      } else if (fetcher.data && fetcher.data.error) {

        switch ((fetcher.data as any).error) {
          case 'User ledger not found':
            setIsFailOpen(true);
            break;
          case 'Please verify your email':
            alert('Please verify your email.');
            break;
          case 'Email verification code is incorrect':
            alert('Email verification code is incorrect.');
            break;
          case 'Recipient user not found':
            setIsFailOpen(true);
            break;
          case 'Insufficient balance':
            alert('Insufficient balance.');
            break;
          case 'Transaction password is incorrect':
            alert('Transaction password is incorrect.');
            break;
          case 'Can not send to yourself':
            alert('Can not send to yourself.');
            break;
          default:
            alert('Transfer failed.');
        }
      }
    }
  }, [fetcher]);

  return (
    <Wrapper>
      <BasicHeader>{t('内部转移')}</BasicHeader>
      <fetcher.Form
        action="/my-page/transfer"
        method="post"
        onSubmit={handleSubmit}
      >
        <FirstSection>
          <BasicInput label={t('收件人 ID')}>
            <SvgUser />
            <StyledInput
              name="recipientId"
              type="text"
              value={recipientId}
              onChange={(e) => setRecipientId(e.target.value)}
            />
          </BasicInput>
          <QuantityInput
            label={t('转账数量')}
            currency="PsuB"
            spanContent={`${(t('可提款'))} : ${psubBalanceInEther.toFixed(2)} PsuB`}
            icon={SvgWithdraw}
            name="amount"
            value={amount}
            onChange={(e) => handleAmountChange(e)}
          />
        </FirstSection>
        <BasicSection
          commission
          headerContent={t('实际收到数量')}
        >
          <RequestWrapper>
            <PsubInput
              value={sendAmount}
              label={t('实际转账数量')}
              usdEquivalent={parseFloat((coinPrice.USD * parseFloat(sendAmount)).toFixed(2))}
              yenEquivalent={parseFloat((coinPrice.CNY * parseFloat(sendAmount)).toFixed(2))}
            />
            <TransactionInput
              type="text"
              name="transactionPassword"
              value={transactionPassword}
              onChange={(e) => setTransactionPassword(e.target.value)}
            />
            <BasicButton
              type="submit"
              disabled={isLoading}
            >
              {t('转账_')}
            </BasicButton>
          </RequestWrapper>
        </BasicSection>
      </fetcher.Form>
      <TransferModal
        isModalOpen={isModalOpen}
        toggleModal={toggleModal}
        headerContent={t('完成')}
      />
      <FailModal
        isModalOpen={isFailOpen}
        toggleModal={() => setIsFailOpen(false)}
        headerContent={t('转移失败!')}
      />
      <SettingModal
        isModalOpen={settingModal}
        toggleModal={handleSettingModalClose}
        headerContent={t('无')}
        content={t('钱包地址或交易密码未登记。请检查您的登记状态并重试。')}
        buttonContent="SETTING"
      />
      {isLoading && <LoadingDots />}
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
  justify-content: center;
  align-items: center;
 & > div:first-child > div {
    display: flex;
    justify-content: space-between;
    align-items: center;

    & > svg {
      width: 2rem;
      height: 2rem;
      path {
        fill: var(--input-dark-sub2);
      }
    }
 }

 & > div:last-child > div {
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
  margin-bottom: 1.25rem;
`;

const StyledInput = styled.input`
  flex-grow: 1;
  width: 100%;
  border: none;
  outline: none;
  background-color: transparent;
  color: var(--content-color);
  text-align: right;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: "Noto Sans SC";
  font-size: 1.125rem;
  font-style: normal;
  font-weight: 500;
`;

export default Transfer;
