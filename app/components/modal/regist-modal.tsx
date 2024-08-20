import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { useTheme } from '~/hooks/use-theme';

import BasicButton from '../button/basic-button';
import SvgPsub from '../icons/psub';

type RegistrationModalProps = {
  isModalOpen: boolean;
  toggleModal: () => void;
};

const RegistrationModal: React.FC<RegistrationModalProps> = ({ isModalOpen, toggleModal }) => {
  const { t } = useTranslation('regist');

  const [theme] = useTheme();

  return (
    <div>
      <ModalOverlay
        isOpen={isModalOpen}
        onClick={toggleModal}
      />
      <GuideModal isOpen={isModalOpen}>
        <ModalHeader>
          {t('会员注册已完成！')}
        </ModalHeader>
        <div>
          {theme === 'dark' ?
            (
              <img
                src="/images/login-logo.png"
                alt="PSUB"
              />
            ) :
            (
              <>
                <SvgPsub />
                <img
                  src="/images/logo-center.png"
                  alt="PSUB"
                />
              </>
            )}
          {`${t('想要参与游戏，请移动到购买')} 
            ${t('MY Page-> NFT')}
            ${t('购买NFT。')}`}
          <BasicButton onClick={toggleModal}>{t('是')}</BasicButton>
        </div>

      </GuideModal>
    </div>
  );
};

const ModalHeader = styled.div`
  position: relative;
  padding: 1rem 0;
  color: white;
  background-color: var(--modal-header-color);
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
  text-align: center;
  font-family: Montserrat;
  font-size: 1rem;
  font-style: normal;
  font-weight: 700;
  line-height: 1rem;
  text-transform: uppercase;
`;

const GuideModal = styled.div<{ isOpen: boolean }>`
  position: fixed; 
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%; 
  max-width: 31.25rem; 
  background-color: var(--modal-content-color);
  backdrop-filter: blur(12px);
  border-radius: 0.5rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  z-index: 1000; 
  display: ${props => props.isOpen ? 'block' : 'none'}; 
  border : 1px solid var(--modal-border-color);


  & > div:last-child {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    text-align: center;
    font-family: "Noto Sans";
    font-size: 1rem;
    font-style: normal;
    font-weight: 400;
    line-height: 1.375rem;
    white-space: pre-line;
    padding: 1.5rem 1rem 0 1rem;
    color: var(--font-color);

    & > svg {
      width: 5rem;
      height: 5.428rem;

      path {
        fill: var(--psub-color);
      }
    }

    & > img {
      width: 6.2rem;
      margin-bottom: 1.5rem;
    }

    & > button {
      margin: 2.5rem 0;
    }
  }
`;

const ModalOverlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999; 
  display: ${props => props.isOpen ? 'block' : 'none'}; 
`;

export default RegistrationModal;
