import { useLoaderData } from '@remix-run/react';
import React, {
  useEffect, /*useState*/
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import SvgTimer from '~/components/icons/timer';
import EventInput from '~/components/input/event-input';
import BasicHeader from '~/components/section/basic-header';
import { useTheme } from '~/hooks/use-theme';
import { toComma } from '~/utils/utils';

import GameCalendar from './game-calendar';
import type { loader } from './server';

export { action, loader, meta } from './server';

const RewardPage: React.FC = () => {
  const {
    ongoingGames, rewardedGames, coinPrice,
  } = useLoaderData<typeof loader>();

  const { t } = useTranslation('game');

  const [theme] = useTheme();

  // 기준 시간
  const startDate = new Date('2024-04-12T05:00:00Z').getTime();
  // 30초마다 감소하는 양
  const decreasePerInterval = 272;
  // 30초 간격
  const intervalTime = 120000;

  // 초기 보상 계산 함수
  const calculateInitialReward = () => {
    const now = Date.now();

    if (now < startDate) {
      return 300000000;
    }
    const elapsedSeconds = Math.floor((now - startDate) / 1000);
    const intervalsPassed = Math.floor(elapsedSeconds / 10);
    const maxInitialReward = 302100000;
    const initialReward = maxInitialReward - intervalsPassed * decreasePerInterval;
    return Math.min(Math.max(initialReward, 0), maxInitialReward);
  };

  const [totalReward, setTotalReward] = useState(calculateInitialReward);

  // 보상 감소 로직
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();

      if (now >= startDate) {
        setTotalReward(prevAmount => {
          const nextAmount = prevAmount - decreasePerInterval;
          return Math.max(nextAmount, 0);
        });
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  const totalInitialSeconds = 120;

  // 타이머의 현재 초를 관리할 state
  const [secondsLeft, setSecondsLeft] = useState(totalInitialSeconds);

  // 타이머 시작 및 감소 로직
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();

      if (now >= startDate) {
        setSecondsLeft(prevSeconds => {
          if (prevSeconds <= 1) {
            return totalInitialSeconds;
          }
          return prevSeconds - 1;
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 원형 테이블 관련 코드
  // const totalSeconds = 12 * 60 * 60;
  // const [secondsLeft, setSecondsLeft] = useState(totalSeconds);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setSecondsLeft((prevSeconds) => (prevSeconds > 0 ? prevSeconds - 1 : 0));
  //   }, 1000);
  //   return () => clearInterval(interval);
  // }, []);

  // const radius = 90;
  // const circumference = 2 * Math.PI * radius;
  // const offset = (1 - secondsLeft / totalSeconds) * circumference;

  return (
    <Wrapper>
      <BasicHeader>
        TOTAL REWARD
      </BasicHeader>
      <PageContainer>
        {/* <CircularProgressContainer>
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 200 200"
          >
            <defs>
              <linearGradient
                id="circleGradient"
                gradientTransform="rotate(90)"
              >
                <stop
                  offset="0%"
                  stop-color="#FFD131"
                />
                <stop
                  offset="100%"
                  stop-color="#FF221C"
                />
              </linearGradient>
            </defs>
            <CircleBg
              cx="100"
              cy="100"
              r={radius}
              strokeWidth="10"
            />
            <Circle
              cx="100"
              cy="100"
              r={radius}
              strokeWidth="10"
              strokeDasharray={`${circumference} ${circumference}`}
              strokeDashoffset={offset}
              stroke="url(#circleGradient)"
            />
            <image
              href="/images/gift.png"
              x="50"
              y="30"
              height="100"
              width="100"
            />
          </svg>
          <TotalRewardText>{t('总奖励')}</TotalRewardText>
        </CircularProgressContainer> */}
        <TotalRewardAmount>{toComma(totalReward)}</TotalRewardAmount>
        <RewardSection>
          <RewardDetail>{`1 PsuB = ${coinPrice.USD.toFixed(2)} $ / ${coinPrice.CNY.toFixed(2)} ¥`}</RewardDetail>
        </RewardSection>
        <TimerSection>
          <TimerText>
            <SvgTimer />
            {t('减少奖励')}
          </TimerText>
          <Timer>{secondsLeft}</Timer>
        </TimerSection>
      </PageContainer>
      <EventContainer
        theme={theme === 'dark'}
      >
        <EventInput
          label={t('个人比赛活动')}
          eventStart
          solo
          variant="event2"
        />
        <EventInput
          label={t('团队比赛活动')}
        />
      </EventContainer>
      <GameCalendar
        ongoingGames={ongoingGames}
        rewardedGames={rewardedGames}
      />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
`;

const TotalRewardAmount = styled.div`
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  margin-top: 0.25rem;
  font-family: Montserrat;
  color : var(--font-color);
`;

const RewardDetail = styled.div`
  background-color: var(--input-dark-sub2);
  color: var(--font-color2);
  border-radius: 9999px;
  padding: 0.56rem 1rem;
  margin-bottom: 2rem;
  width: 100%;
  font-family: "Noto Sans SC";
`;

const TimerSection = styled.div`
  border: 1px solid var(--sub-color2);
  border-radius: 0.5rem;
  padding: 1rem 2.5rem;
  width: 80%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 0.25rem;
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.25);
  white-space: nowrap;
  background-color: var(--timer-background);
  color: var(--timer-color);
`;

const TimerText = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 0.31rem;
  color: var(--timer-color);
  font-size: 1rem;
  font-family: Montserrat;
  font-style: normal;
  font-weight: 400;
  text-transform: uppercase;
  margin-bottom: 0.5rem;
  line-height: 1rem;

  svg {
    width: 1.25rem;
    height: 1.25rem;

    path {
      fill: var(--timer-color);
    }
  }
`;

const Timer = styled.div`
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 700;
  text-transform: uppercase;
  font-family: "Noto Sans SC";
  color: var(--font-color);
`;

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.25rem;
  background-color: var(--game-background);
`;

const RewardSection = styled.div`
  text-align: center;
  width: 65%;
`;

const EventContainer = styled.div<{theme? : boolean}>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem 1.25rem;
  background: var(--bg-color);
  
  border-top: ${({ theme }) => (theme ? 'none' : '1px solid var(--gray-4)')};
`;

// const CircularProgressContainer = styled.div`
//   width: 100%;
//   position: relative;
//   margin-bottom: 2.5rem;
// `;

// const CircleBg = styled.circle`
//   fill: none;
//   stroke: #eeeeee;
// `;

// const Circle = styled.circle`
//   fill: none;
//   stroke-linecap: round;
//   transform: rotate(-90deg);
//   transform-origin: 50% 50%;
// `;

// const TotalRewardText = styled.div`
//   position: absolute;
//   top: 75%;
//   left: 50%;
//   transform: translate(-50%, -100%);
//   font-family: Montserrat;
//   font-size: 1.25rem;
//   font-style: normal;
//   font-weight: 700;
//   line-height: 1.25rem;
//   text-transform: uppercase;
//   white-space: nowrap;
// `;

export default RewardPage;
