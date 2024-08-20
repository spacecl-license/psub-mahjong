import { Link, useLoaderData, useNavigate } from '@remix-run/react';
import { formatEther } from 'ethers/lib/utils';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import NetworkStatusBadge from '~/components/badge/network-status-badge';
import BasicButton from '~/components/button/basic-button';
import { Gift, History, Withdraw } from '~/components/icons';
import PsubInput from '~/components/input/psub-input';
import SettingModal from '~/components/modal/setting-modal';
import BasicHeader from '~/components/section/basic-header';
import { toComma } from '~/utils/utils';

import type { loader } from './server';

export { loader, meta } from './server';

const MyWallet = () => {
  const {
    psubBalance, coinPrice, userAddress, userTransactionPassword,
  } = useLoaderData<typeof loader>();
  const { t } = useTranslation('my-wallet');

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

  return (
    <>
      <BasicHeader>MY WALLET</BasicHeader>
      <Wrapper>
        <NetworkStatusBadge
          label="klaytn"
          isConnect={true}
        />
        <InputWrapper>
          <PsubInput
            value={toComma(formatEther(psubBalance))}
            label="PSUB"
            usdEquivalent={Number((coinPrice.USD * parseFloat(formatEther(psubBalance))).toFixed(2))}
            yenEquivalent={Number((coinPrice.CNY * parseFloat(formatEther(psubBalance))).toFixed(2))}
          />
          <Link to="/my-page/charge">
            <BasicButton>
              {t('充值')}
            </BasicButton>
          </Link>
        </InputWrapper>
        <WalletGroupWrapper>
          <Link to="/my-page/transfer">
            <WalletGroup>
              <Gift />
              <p>{t('内部转账')}</p>
            </WalletGroup>
          </Link>
          <Link to="/my-page/withdraw">
            <WalletGroup>
              <Withdraw />
              <p>{t('提现')}</p>
            </WalletGroup>
          </Link>
          <Link to="/my-page/history">
            <WalletGroup>
              <History />
              <p>{t('记录')}</p>
            </WalletGroup>
          </Link>
        </WalletGroupWrapper>
      </Wrapper>
      <SettingModal
        isModalOpen={settingModal}
        toggleModal={handleModalClose}
        headerContent={t('无')}
        content={t('钱包地址或交易密码未登记。请检查您的登记状态并重试。')}
        buttonContent="SETTING"
      />
    </>
  );
};

const Wrapper = styled.div`
  padding: 1.5rem 1.25rem;
`;

const InputWrapper = styled.div`
  margin-top: 1.5rem;

  & > a > button {
    margin-top: 3rem;
  }
`;

const WalletGroupWrapper = styled.div`
  position: fixed;
  width: 100%;
  padding: 1rem 1.25rem;
  bottom: 3.75rem;
  left: 0;
  background-color: var(--input-dark-sub2);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const WalletGroup = styled.div`
  width: 5rem;
  height: 5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  color: var(--font-color2);

  & > svg {
    width: 3rem;
    height: 3rem;
    path {
      fill: var(--font-color2);
    }
  }

  & > p {
    color: var(--font-color2);
    text-align: center;
    font-size: 1rem;
    font-style: normal;
    font-weight: 400;
    line-height: 1.375rem;
    text-transform: uppercase;
  }
`;

export default MyWallet;
