import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import SvgLanguage from '../icons/language';

const LanguageToggle = () => {
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
      <Language isActive={!isChinese}>EN</Language>
      <Language isActive={isChinese}>CN</Language>
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
  width: 2rem;
  height: 2rem;
  background-size: cover;
  
  svg {
    width: 100%;
    height: 100%;
    path {
      fill: var(--header-global-color) !important;
    }
  }

`;

const Language = styled.span<{ isActive: boolean }>`
  width: 1.25rem; 
  text-align: center;
  font-family: "Noto Sans SC";
  font-size: 0.875rem;
  font-style: normal;
  font-weight: ${({ isActive }) => isActive ? '700' : '400'};
  line-height: 1.375rem;
  text-transform: uppercase;
  color: ${({ isActive }) => isActive ? 'var(--gray)' : 'var(--header-gray-color)'};
  border-radius: 1.25rem;
  transition: all 0.3s;
  
`;

export default LanguageToggle;
