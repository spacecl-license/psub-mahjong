import { Form, useActionData, useLoaderData } from '@remix-run/react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import BasicButton from '~/components/button/basic-button';
import SvgBinance from '~/components/icons/binance';
import SvgPsub from '~/components/icons/psub';
import LoginInput from '~/components/input/login-input';
import LoadingDots from '~/components/items/loading';
import BasicHeader from '~/components/section/basic-header';

import type { action, loader } from './server';

export { action, loader, meta } from './server';

const AddressSetting = () => {
  const [formValues, setFormValues] = useState({
    psubAddress: '',
    bnbAddress: '',
  });

  const { userAddress } = useLoaderData<typeof loader>();
  const [isLoading, setIsLoading] = useState(false);
  const data = useActionData<typeof action>();

  const { t } = useTranslation('setting');

  const handleChange = (e : any) => {
    const { name, value } = e.target;

    setFormValues(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    setIsLoading(true);
  };

  useEffect(() => {
    if (data && data.error) {
      alert(data.error);
      setIsLoading(false);
    } else if (data && data.user) {
      setIsLoading(false);
      alert('success');
    }
  }, [data]);

  return (
    <>
      {isLoading && <LoadingDots />}
      <BasicHeader>
        ADDRESS SETTING
      </BasicHeader>
      <Wrapper>
        <Content>
          {t('设置您的钱包地址。')}
        </Content>
        <Form
          method="POST"
          onSubmit={handleSubmit}
        >
          <LoginInput
            type="text"
            label={t('BNB地址')}
            name="bnbAddress"
            icon={SvgBinance}
            value={userAddress && userAddress?.bnbAddress !== '' ? userAddress.bnbAddress : formValues.bnbAddress}
            onChange={handleChange}
            disabled={userAddress !== null}
          />
          <LoginInput
            type="text"
            label={t('PSUB地址')}
            name="psubAddress"
            icon={SvgPsub}
            value={userAddress && userAddress?.psubAddress !== '' ? userAddress.psubAddress : formValues.psubAddress}
            onChange={handleChange}
            disabled={userAddress !== null}
          />
          {userAddress === null && (
            <BasicButton
              type="submit"
            >
              {t('更改')}
            </BasicButton>
          )}
        </Form>
      </Wrapper>
    </>
  );
};

const Wrapper = styled.div`
  width: 100%;
  padding: 1.5rem 1.25rem;

  & > form > div:nth-child(1) {
    margin-top: 2.5rem;
  }

  & > form > div:nth-child(2) {
    margin-top: 1.5rem;
    margin-bottom: 4rem;
  }
`;

const Content = styled.div`
  color: var(--content-color);
  text-align: center;
  font-family: "Noto Sans SC";
  font-size: 1rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.375rem;
  white-space: pre-line;
`;

export default AddressSetting;
