import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import SvgLanguage from '../icons/language';

const GameLanguageToggle = () => {
  const { i18n } = useTranslation();

  const isChinese = i18n.language === 'cn';

  const toggleLanguage = () => {
    const newLang = isChinese ? 'en' : 'cn';
    i18n.changeLanguage(newLang);
  };

  return (
    <LanguageToggleContainer onClick={toggleLanguage}>
      <LanguageIcon>
        <SvgLanguage />
      </LanguageIcon>
    </LanguageToggleContainer>
  );
};

const LanguageToggleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const LanguageIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 1.5rem;
  height: 1.5rem;
  background-size: cover;
  
  svg {
    width: 100%;
    height: 100%;
    path {
      fill: var(--dark-gray-3);
    }
  }

`;

export default GameLanguageToggle;
