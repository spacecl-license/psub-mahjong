import {
  Form,
  useActionData,
  useFetcher,
  useNavigate,
  useSearchParams,
} from '@remix-run/react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import BasicButton from '~/components/button/basic-button';
import SvgPassword from '~/components/icons/password';
import SvgPasswordCheck from '~/components/icons/password-check';
import SvgRecommend from '~/components/icons/recommend';
import SvgUser from '~/components/icons/user';
import LoginInput from '~/components/input/login-input';
import PasswordInput from '~/components/input/password-input';
import LoadingDots from '~/components/items/loading';
import RegistrationModal from '~/components/modal/regist-modal';
import { useTheme } from '~/hooks/use-theme';

import Header from '../_mahjong/header';
import type { action } from './server';

export { action, meta } from './server';

export default function RegistPage() {
  const { t } = useTranslation('regist');
  const navigate = useNavigate();
  const data = useActionData<typeof action>();
  const emailCodeFetcher = useFetcher();
  const [searchParams] = useSearchParams();

  const [theme] = useTheme();

  const [formValues, setFormValues] = useState({
    id: '',
    password: '',
    checkPassword: '',
    referralCode: searchParams.get('referralCode') || '',
    transactionPassword: '',
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const toggleModal = () => {
    navigate('/login');
    setIsModalOpen(!isModalOpen);
  };

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

  const handleRegistSubmit = () => {
    setIsLoading(true);
  };

  useEffect(() => {
    if (data && data.error) {
      alert(data.error);
      setIsLoading(false);
    } else if (data && data.user) {
      setIsLoading(false);
      setIsModalOpen(true);
    }
  }, [data]);

  return (
    <>
      <Header />
      <LoginPageContainer>
        {isLoading && <LoadingDots />}

        <HeaderImg>
          {theme === 'dark' ? (
            <img src="/images/logo-center-dark.png" alt="PSUB" />
          ) : (
            <img src="/images/logo-center.png" alt="PSUB" />
          )}
        </HeaderImg>
        <Form method="POST" onSubmit={handleRegistSubmit}>
          <LoginInput
            icon={SvgUser}
            type="text"
            label="ID"
            name="id"
            value={formValues.id}
            onChange={handleChange}
          />
          <PasswordInput
            icon={SvgPassword}
            label={t('密码')}
            name="password"
            value={formValues.password}
            onChange={handleChange}
          />
          <PasswordInput
            icon={SvgPasswordCheck}
            label={t('确认密码')}
            name="checkPassword"
            value={formValues.checkPassword}
            onChange={handleChange}
          />
          <LoginInput
            icon={SvgRecommend}
            type="text"
            label={t('推荐人')}
            name="referralCode"
            value={formValues.referralCode}
            onChange={handleChange}
          />
          <BasicButton type="submit">{t('完成')}</BasicButton>
        </Form>
        <RegistrationModal
          isModalOpen={isModalOpen}
          toggleModal={toggleModal}
        />
      </LoginPageContainer>
    </>
  );
}

const LoginPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1.25rem;
  width: 100%;
  margin: 0 auto;

  & > form {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.625rem;

    & > button {
      margin-top: 4rem;
    }
  }
`;

const HeaderImg = styled.h1`
  margin-bottom: 2.5rem;
  display: flex;
  width: 100%;
  justify-content: center;

  > img {
    width: 8.75rem;
    height: 3.01031rem;
  }
`;
