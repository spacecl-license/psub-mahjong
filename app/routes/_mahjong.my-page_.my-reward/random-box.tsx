import { Link, useFetcher } from '@remix-run/react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { THEME } from '~/common/constants';
import BasicButton from '~/components/button/basic-button';
import RandomBoxItem from '~/components/items/random-box';
import RandomBoxNoneModal from '~/components/modal/random-box-none-modal';
import { useTheme } from '~/hooks/use-theme';

import RandomBoxModal from './random-box-modal';
import type { QuantifyRandomBox } from './route';

type RandomBoxProps = {
  quantifyRandomBox: QuantifyRandomBox[];
  onRandomBoxClick: (QuantifyRandomBox: QuantifyRandomBox) => void;
  selectedRandomBox: QuantifyRandomBox;
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  randomBoxNoneModalOpen: boolean;
  setRandomBoxNoneModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isAutoBattle: boolean;
};

const RandomBox : React.FC<RandomBoxProps> = ({
  quantifyRandomBox,
  onRandomBoxClick,
  selectedRandomBox,
  isModalOpen,
  setIsModalOpen,
  randomBoxNoneModalOpen,
  setRandomBoxNoneModalOpen,
  isAutoBattle,
}) => {
  const [isAutomatic, setIsAutomatic] = useState(isAutoBattle);

  const [, setTheme] = useTheme();

  const fetcher : any = useFetcher();

  const toggleAutoBattle = () => {
    fetcher.submit({ }, { method: 'PUT' });
    setIsAutomatic(!isAutomatic);
  };

  const { t } = useTranslation('my-reward');

  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data){
      if (fetcher.data.error){
        alert(fetcher.data.error);
      }
    }
  }, [fetcher]);

  return (
    <RandomBoxWrapper>
      <ToggleWrapper>
        {t('离线自动参与')}
        <ToggleButton
          isActive={isAutomatic}
          onClick={() => toggleAutoBattle()}
          disabled={fetcher.state !== 'idle'}
        />
      </ToggleWrapper>
      <Link to="/game-hub">
        <BasicButton
          onClick={() => setTheme(THEME.DARK)}
          big
        >
          {t('游戏开始!')}
        </BasicButton>
      </Link>

      <RandomBoxItemWrapper>
        {quantifyRandomBox.map(quantifyRandomBox => (
          <RandomBoxItem
            key={quantifyRandomBox.month}
            quantity={quantifyRandomBox.quantity}
            onClick={() => onRandomBoxClick(quantifyRandomBox)}
            name={quantifyRandomBox.name}
          />
        ))}
      </RandomBoxItemWrapper>
      {randomBoxNoneModalOpen && (
        <RandomBoxNoneModal
          isModalOpen={randomBoxNoneModalOpen}
          toggleModal={() => setRandomBoxNoneModalOpen(!randomBoxNoneModalOpen)}
          headerContent={t('无')}
        />
      )}
      {isModalOpen && (
        <RandomBoxModal
          isModalOpen={isModalOpen}
          toggleModal={() => setIsModalOpen(!isModalOpen)}
          selectedReward={selectedRandomBox}
        />
      )}
    </RandomBoxWrapper>
  );
};

export default RandomBox;

const RandomBoxWrapper = styled.div`
  width: 100%;
  padding: 1rem;
`;

const RandomBoxItemWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  margin-top: 2.5rem;
  gap: 1rem;
`;

const ToggleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  background-color: var(--reward-bg2);
  padding: 1rem 1.25rem;
  border-radius: 0.5rem;
  border: 1px solid var(--random-box-border);
  color : var(--font-color);
  text-overflow: ellipsis;
  font-family: "Noto Sans SC";
  font-size: 0.75rem;
  font-style: normal;
  font-weight: 400;
  line-height: 0.75rem;
`;

const ToggleButton = styled.button<{ isActive: boolean }>`
  position: relative;
  width: 3.5rem;
  height: 1.35rem;
  border-radius: 0.75rem;
  background-color: ${({ isActive }) => (isActive ? 'var(--random-box-toggle-color)' : '#ccc')};
  cursor: pointer;

  &::after {
    content: '';
    position: absolute;
    top: -0.05rem;
    left: ${({ isActive }) => (isActive ? '2.1rem' : '-0.1rem')};
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 50%;
    background-color: ${({ isActive }) => (isActive ? 'var(--random-box-toggle-color2)' : '#AAA')};
    transition: left 0.3s;
  }
`;
