import { Form, useActionData, useLoaderData } from '@remix-run/react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { QRCode } from 'react-qrcode-logo';
import styled from 'styled-components';

import { TOKEN } from '~/common/constants';
import BasicButton from '~/components/button/basic-button';
import SvgWallet from '~/components/icons/wallet';
import SvgWithdraw from '~/components/icons/withdraw';
import CopyInput from '~/components/input/copy-input';
import QuantityInput from '~/components/input/quantity-input';
import SelectInput from '~/components/input/select-input';
import BasicHeader from '~/components/section/basic-header';

import type { action, loader } from './server';

export { action, loader, meta } from './server';

const Charge = () => {
  const { depositWalletAddress, options } = useLoaderData<typeof loader>();
  const [quantity, setQuantity] = useState('0');
  const [token, setToken] = useState(TOKEN.PSUB);
  const data = useActionData<typeof action>();
  const { t } = useTranslation('my-wallet');

  useEffect(() => {
    if (data) {
      if (data.error) {
        alert(data.error);
      } else if (data.invoice) {
        alert(`please ${quantity} ${token} send to deposit address`);
      }
    }
  }, [data]);

  return (
    <>
      <BasicHeader>
        CHARGE
      </BasicHeader>
      <Wrapper>
        <Form method="POST">
          <SelectInput
            label={t('选择代币')}
            options={options}
            name="token"
            selectedValue={token}
            onChange={value => setToken(value as TOKEN)}
          />
          <CopyInput
            label={t('存款地址')}
            content={depositWalletAddress}
            wallet
            icon={SvgWallet}
          />
          <QuantityInput
            label={t('充值量')}
            currency={token}
            name="quantity"
            icon={SvgWithdraw}
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
          <QRCode
            value={depositWalletAddress}
            size={250}
          />
          <BasicButton type="submit">
            {t('充值')}
          </BasicButton>
        </Form>
      </Wrapper>
    </>
  );
};

const Wrapper = styled.div`
  padding : 2.5rem 1.5rem;

  & > form { 
    display: flex;
    gap: 1.5rem;
    flex-direction: column;
    justify-content: center;
    align-items: center;

      & > div:nth-child(2) {
       & > div {
          display: flex;
          justify-content: space-between;
          align-items: center;
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
              fill: var(--main-color);
            }
          }
        }
      }
      & > div:nth-child(3) > div {
        padding: 1rem;
        display: flex;
        align-items: center;

        & > div > svg {
          width: 2rem;
          height: 2rem;
          path {
            fill: var(--main-color);
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

      & > button {
        margin-top : 3rem;
      }
  }

`;

export default Charge;
