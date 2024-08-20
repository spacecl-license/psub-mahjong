import { Form, useActionData } from '@remix-run/react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import BasicButton from '~/components/button/basic-button';
import SvgPassword from '~/components/icons/password';
import SvgPasswordCheck from '~/components/icons/password-check';
import LoginInput from '~/components/input/login-input';
import PasswordInput from '~/components/input/password-input';
import LoadingDots from '~/components/items/loading';
import BasicHeader from '~/components/section/basic-header';

import type { action } from './server';

export { action, meta } from './server';

const TransactionSetting = () => {
  const [formValues, setFormValues] = useState({
    transactionPassword: '',
    transactionPasswordCheck: '',
  });
  const { t } = useTranslation('setting');
  const [isLoading, setIsLoading] = useState(false);
  const data = useActionData<typeof action>();

  const handleSubmit = () => {
    setIsLoading(true);
  };

  const handleChange = (e : any) => {
    const { name, value } = e.target;

    setFormValues(prev => ({
      ...prev,
      [name]: value,
    }));
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
        TRANSACTION SETTING
      </BasicHeader>
      <Wrapper>
        <Content>
          {t('设置您的交易密码。')}
        </Content>
        <Form
          method="POST"
          onSubmit={handleSubmit}
        >
          <PasswordInput
            label={t('交易密码')}
            name="transactionPassword"
            icon={SvgPassword}
            value={formValues.transactionPassword}
            onChange={handleChange}
          />
          <LoginInput
            type="password"
            name="transactionPasswordCheck"
            label={t('确认密码')}
            icon={SvgPasswordCheck}
            value={formValues.transactionPasswordCheck}
            onChange={handleChange}
          />
          <BasicButton
            type="submit"
          >
            {t('更改')}
          </BasicButton>
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
    margin-bottom: 3rem;
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

export default TransactionSetting;
