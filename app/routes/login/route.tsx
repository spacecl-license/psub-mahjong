import { Form, Link, useActionData } from '@remix-run/react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import BasicButton from '~/components/button/basic-button';
import SvgPassword from '~/components/icons/password';
import SvgPsub from '~/components/icons/psub';
import SvgUser from '~/components/icons/user';
import LoginInput from '~/components/input/login-input';
import LanguageToggle from '~/components/items/language';
import LoadingDots from '~/components/items/loading';
import { useTheme } from '~/hooks/use-theme';

import type { action } from './server';

export { action, meta } from './server';

export default function LoginPage() {
  const { t } = useTranslation('login');
  const [isLoading, setIsLoading] = useState(false);
  const data = useActionData<typeof action>();
  const [theme] = useTheme();

  const [formValues, setFormValues] = useState({
    id: '',
    password: '',
  });

  const handleChange = (e : any) => {
    const { name, value } = e.target;

    setFormValues(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (data) {
      setIsLoading(false);

      if (data.error) {
        alert(data.error);
      }
    }
  }, [data]);

  const handleLoginSubmit = () => {
    setIsLoading(true);
  };

  return (
    <Container>
      {isLoading && <LoadingDots />}
      <LanguageWrapper>
        <LanguageToggle />
      </LanguageWrapper>
      {theme === 'dark' ? (
        <DarkTitle>
          <img
            src="/images/login-logo.png"
            alt="PSUB"
          />
        </DarkTitle>
      ) : (
        <>
          <Logo>
            <SvgPsub />
          </Logo>
          <Title>
            <img
              src="/images/logo-center.png"
              alt="PSUB"
            />
          </Title>
        </>
      )}

      <Form
        method="POST"
        onSubmit={handleLoginSubmit}
      >
        <LoginInput
          icon={SvgUser}
          type="text"
          label={t('用户名')}
          name="id"
          value={formValues.id}
          onChange={handleChange}
        />
        <LoginInput
          icon={SvgPassword}
          type="password"
          label={t('密码')}
          name="password"
          value={formValues.password}
          onChange={handleChange}
        />
        <BasicButton type="submit">{t('登录')}</BasicButton>
        <Link to="/regist">
          <BasicButton
            variant="reversal"
            type="button"
          >
            {t('注册')}
          </BasicButton>
        </Link>
      </Form>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100%;
  padding: 1.25rem;

  & > a {
    width: 100%;
    margin-bottom: 1rem;

    & > button {
      margin: 0;
    }
  }

  & > form {
    width: 100%;
    margin-bottom: 1rem;

    & > div:first-child {
      margin-bottom: 1.5rem;
    }

    & > button {
      margin-top: 3rem;
    }
  }
`;

const LanguageWrapper = styled.div`
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
`;

const Logo = styled.div`
  width: 7.5rem;
  height: 7.5rem;
  height: auto; 

  svg {
    width: 100%;
    height: 100%;
     path {
      fill : var(--input-dark-sub2);
    }
  }
`;

const Title = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 4rem;

  > img {
    width: 8.75rem;
    height: 3.01031rem;
  }
`;

const DarkTitle = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 4rem;

  > img {
    width: 8.75rem;
    height: 9.499rem;
  }
`;
