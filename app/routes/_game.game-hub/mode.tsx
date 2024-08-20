import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import SvgPeople2 from '~/components/icons/people2';
import SvgPeople3 from '~/components/icons/people3';
import SvgPeople5 from '~/components/icons/people5';
import GameHeader from '~/components/section/game-header';

interface ModeProps {
  setMode: React.Dispatch<React.SetStateAction<string>>;
  setModeOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Mode: React.FC<ModeProps> = ({ setMode, setModeOpen }) => {
  const { t } = useTranslation('game-hub');

  const handleMode = (players : number) => {
    setMode(`${players}p`);
    setModeOpen(false);
  };

  return (
    <Wrapper>
      <GameHeader border>
        {t('模式选择')}
      </GameHeader>
      <ModeItemWrapper>
        <ModeItem
          players={2}
          onClick={() => handleMode(2)}
        >
          <div>
            <div>
              {t('单身战斗')}
            </div>
            <div>
              <span>
                2
              </span>
              {t('名游戏者')}
            </div>
          </div>
          <SvgPeople2 />
        </ModeItem>
        <ModeItem
          players={3}
          onClick={() => handleMode(3)}
        >
          <div>
            <div>
              {t('单身战斗')}
            </div>
            <div>
              <span>
                3
              </span>
              {t('名游戏者')}
            </div>
          </div>
          <SvgPeople3 />
        </ModeItem>
        <ModeItem
          players={5}
          onClick={() => handleMode(5)}
        >
          <div>
            <div>
              {t('单身战斗')}
            </div>
            <div>
              <span>
                5
              </span>
              {t('名游戏者')}
            </div>
          </div>
          <SvgPeople5 />
        </ModeItem>
      </ModeItemWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  color: var(--font-color);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
`;

const ModeItemWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 1.5rem;
  gap: 1.5rem;
  width: 100%;
`;

const ModeItem = styled.div<{players : number}>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 2rem 1.5rem;
  border-radius: 0.5rem;
  background: ${({ players }) => {
    switch (players) {
      case 2:
        return 'linear-gradient(90deg, #1B68DC 0%, #3FCBD4 100%)';
      case 3:
        return 'linear-gradient(90deg, #C71D97 0%, #BE83D2 100%)';
      case 5:
        return 'linear-gradient(90deg, #F83600 0%, #F9D423 100%)';
      default:
        return 'none';
    }
  }};

  margin-bottom: ${({ players }) => players === 5 ? '5rem' : 'none'};

  & > div:first-child {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 1rem;

    & > div:first-child {
      color: var(--font-color);
      font-family: "Noto Sans SC";
      font-size: 1.25rem;
      font-style: normal;
      font-weight: 400;
      line-height: 1.25rem;
      text-transform: capitalize;
    }

    & > div:last-child {
      color: var(--font-color);
      text-align: center;
      font-family: Montserrat;
      font-size: 2rem;
      font-style: normal;
      font-weight: 700;
      line-height: 2rem;
      text-transform: capitalize;

      & > span {
        color: var(--font-color);
        text-align: center;
        font-family: "Noto Sans SC";
        font-size: 2.75rem;
        font-style: normal;
        font-weight: 700;
        line-height: 2.75rem;
        text-transform: uppercase;
        margin-right: 0.5rem;
      }
    }

    & > svg {
      width: 4.60625rem;
      height: 2rem;

      path {
        fill: var(--font-color);
      }
    }
  }
`;

export default Mode;
