import { useLoaderData } from '@remix-run/react';
import { formatEther } from 'ethers/lib/utils';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import BasicHeader from '~/components/section/basic-header';
import { BasicTab } from '~/components/tab/basic-tab';
import { formatDate } from '~/utils/date';
import { toComma } from '~/utils/utils';

import type { loader } from './server';
import Transfer from './transfer';
import Withdrawal from './withdrawal';

export { loader, meta } from './server';

const History = () => {
  const { transfers, withdraws } = useLoaderData<typeof loader>();
  const [activeTab, setActiveTab] = useState('TRANSFER');

  const { t } = useTranslation('my-wallet');

  return (
    <Wrapper>
      <BasicHeader>HISTORY</BasicHeader>
      <BasicTab
        firstTabTitle={t('内部转账')}
        secondTabTitle={t('提现')}
        firstTabValue="TRANSFER"
        secondTabValue="WITHDRAWAL"
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      {activeTab === 'TRANSFER' &&
        transfers.map((transfer: any, i: number) => {

          const fromLedger = transfer?.userReferral ? transfer.userReferral?.user?.id : transfer.fromLedger?.user?.id;

          return (
            <Transfer
              key={i}
              amount={toComma(formatEther(transfer.amount).toString())}
              date={formatDate(transfer.createdAt, 'YYYY.MM.DD HH:mm:ss')}
              fromId={fromLedger ?? 'master'}
              toId={transfer.toLedger?.user?.id ?? 'master'}
            />
          );

        })}
      {activeTab === 'WITHDRAWAL' &&
        withdraws.map((withdraw: any, i: number) => (
          <Withdrawal
            key={i}
            amount={toComma(formatEther(withdraw.amount).toString())}
            date={formatDate(withdraw.createdAt, 'YYYY.MM.DD HH:mm:ss')}
            address={withdraw.toUserAddress.psubAddress}
          />
        ))}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
`;

export default History;
