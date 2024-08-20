import { useFetcher, useLoaderData, useNavigate } from '@remix-run/react';
import { formatEther } from 'ethers/lib/utils';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import SvgUser from '~/components/icons/user';

import LoseModal from './lose-modal';
import type { loader } from './server';
import WinModal from './win-modal';

export { loader, meta } from './server';

const BattleRoom = () => {
  const { t } = useTranslation('game-hub');

  const {
    randomBox, randomBoxGame, playersBox, isSeen,
  } = useLoaderData<typeof loader>();

  const fetcher = useFetcher();

  const monthlyNames = [
    '松鹤',
    '梅鸟',
    '樱花',
    '黑胡',
    '兰草',
    '牡丹',
    '红胡',
    '空山',
    '菊俊',
    '丹枫',
    '梧桐',
    '雨',
  ];

  const rankImages = [
    '/images/rank1.png',
    '/images/rank2.png',
    '/images/rank3.png',
    '/images/rank4.png',
    '/images/rank5.png',
  ];

  const countImages = [
    '',
    '/images/count0.png',
    '/images/count1.png',
    '/images/count2.png',
    '/images/count3.png',
  ];

  const playerCount = randomBoxGame.players.length;

  const [winModalOpen, setWinModalOpen] = useState(false);
  const [loseModalOpen, setLoseModalOpen] = useState(false);
  const [currentCount, setCurrentCount] = useState(10);

  // 카운트 다운 및 랭크 이미지 변경
  useEffect(() => {
    if (isSeen) {
      setCurrentCount(0);
    } else {
      const timer = currentCount > 0 ? setInterval(() => {
        setCurrentCount(prevCount => prevCount - 1);
      }, 1000) : null;

      if (currentCount === 0) {
        fetcher.submit(
          { randomBoxGameId : randomBoxGame._id },
          {  action: '/api/is-seen-count', method: 'POST'  });
      }

      return () => {
        if (timer) clearInterval(timer);
      };
    }
  }, [currentCount]);

  const navigate = useNavigate();

  const handleModalClose = () => {
    setWinModalOpen(false);
    setLoseModalOpen(false);
    navigate('/game-hub');
  };

  const handleContainerClick = () => {
    if (currentCount === 0) {
      if (randomBox.userReferral._id === randomBoxGame.winnerPlayer.box.userReferral._id) {
        setWinModalOpen(true);
      } else {
        setLoseModalOpen(true);
      }
    }
  };

  useEffect(() => {
    if (currentCount === 0) {
      const timer = setTimeout(() => {
        if (randomBox.userReferral._id === randomBoxGame.winnerPlayer.box.userReferral._id) {
          setWinModalOpen(true);
        } else {
          setLoseModalOpen(true);
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [
    currentCount,
    randomBox.userReferral._id,
    randomBoxGame.winnerPlayer.box.userReferral._id,
    t,
  ]);

  const PlayerContainer : any = useMemo(() => {
    switch ((playerCount as number)) {
      case 2:
        return (
          <GameContainer>
            <UserWrapper>
              <IdWrapper>
                <SvgUser />
                {playersBox[0].userReferral.user.id}
              </IdWrapper>
              {currentCount !== 0 ? (
                <img
                  src="/images/rank-none.png"
                  alt=""
                />
              ) : (
                <img
                  src={rankImages[randomBoxGame.players[0].rank]}
                  alt=""
                />
              )}
              {currentCount === 0 && (
                <RewardWrapper>
                  {randomBoxGame.players[0].rewardRate * 100}
                  %
                </RewardWrapper>
              )}
            </UserWrapper>
            <UserWrapper>
              {currentCount !== 0 ? (
                <img
                  src="/images/rank-none.png"
                  alt=""
                />
              ) : (
                <img
                  src={rankImages[randomBoxGame.players[1].rank]}
                  alt=""
                />
              )}
              {currentCount === 0 && (
                <RewardWrapper>
                  {randomBoxGame.players[1].rewardRate * 100}
                  %
                </RewardWrapper>
              )}
              <IdWrapper>
                <SvgUser />
                {playersBox[1].userReferral.user.id}
              </IdWrapper>
            </UserWrapper>
            <VsWrapper
              src="/images/game-background.png"
              alt=""
            />
            {currentCount > 0 && (
              <CountImg
                count={currentCount}
              >
                {currentCount}
              </CountImg>
            )}
          </GameContainer>
        );
      case 3:
        return (
          <GameContainer>
            <UserWrapper>
              <IdWrapper>
                <SvgUser />
                {playersBox[0].userReferral.user.id}
              </IdWrapper>
              {currentCount !== 0 ? (
                <img
                  src="/images/rank-none.png"
                  alt=""
                />
              ) : (
                <img
                  src={rankImages[randomBoxGame.players[0].rank]}
                  alt=""
                />
              )}
              {currentCount === 0 && (
                <RewardWrapper>
                  {randomBoxGame.players[0].rewardRate * 100}
                  %
                </RewardWrapper>
              )}
            </UserWrapper>
            <VsWrapper
              src="/images/game-background.png"
              alt=""
            />
            <ThreePlayerWrapper>
              <UserWrapper>
                <IdWrapper>
                  <SvgUser />
                  {playersBox[1].userReferral.user.id}
                </IdWrapper>
                {currentCount !== 0 ? (
                  <img
                    src="/images/rank-none.png"
                    alt=""
                  />
                ) : (
                  <img
                    src={rankImages[randomBoxGame.players[1].rank]}
                    alt=""
                  />
                )}
                {currentCount === 0 && (
                  <RewardWrapper>
                    {randomBoxGame.players[1].rewardRate * 100}
                    %
                  </RewardWrapper>
                )}
              </UserWrapper>
              <UserWrapper>
                <IdWrapper>
                  <SvgUser />
                  {playersBox[2].userReferral.user.id}
                </IdWrapper>
                {currentCount !== 0 ? (
                  <img
                    src="/images/rank-none.png"
                    alt=""
                  />
                ) : (
                  <img
                    src={rankImages[randomBoxGame.players[2].rank]}
                    alt=""
                  />
                )}
                {currentCount === 0 && (
                  <RewardWrapper>
                    20%
                  </RewardWrapper>
                )}
              </UserWrapper>
            </ThreePlayerWrapper>
            {currentCount > 0 && (
              <CountImg
                count={currentCount}
              >
                {currentCount}
              </CountImg>
            )}
          </GameContainer>
        );
      case 5:
        return (
          <GameContainer>
            <UserWrapper>
              <IdWrapper>
                <SvgUser />
                {playersBox[0].userReferral.user.id}
              </IdWrapper>
              {currentCount !== 0 ? (
                <img
                  src="/images/rank-none.png"
                  alt=""
                />
              ) : (
                <img
                  src={rankImages[randomBoxGame.players[0].rank]}
                  alt=""
                />
              )}
              {currentCount === 0 && (
                <RewardWrapper>
                  {randomBoxGame.players[0].rewardRate * 100}
                  %
                </RewardWrapper>
              )}
            </UserWrapper>
            <VsWrapper
              src="/images/game-background.png"
              alt=""
            />
            <FivePlayerWrapper1>
              <UserWrapper>
                <IdWrapper>
                  <SvgUser />
                  {playersBox[1].userReferral.user.id}
                </IdWrapper>
                {currentCount !== 0 ? (
                  <img
                    src="/images/rank-none.png"
                    alt=""
                  />
                ) : (
                  <img
                    src={rankImages[randomBoxGame.players[1].rank]}
                    alt=""
                  />
                )}
                {currentCount === 0 && (
                  <RewardWrapper>
                    {randomBoxGame.players[1].rewardRate * 100}
                    %
                  </RewardWrapper>
                )}
              </UserWrapper>
              <UserWrapper>
                <IdWrapper>
                  <SvgUser />
                  {playersBox[2].userReferral.user.id}
                </IdWrapper>
                {currentCount !== 0 ? (
                  <img
                    src="/images/rank-none.png"
                    alt=""
                  />
                ) : (
                  <img
                    src={rankImages[randomBoxGame.players[2].rank]}
                    alt=""
                  />
                )}
                {currentCount === 0 && (
                  <RewardWrapper>
                    {randomBoxGame.players[2].rewardRate * 100}
                    %
                  </RewardWrapper>
                )}
              </UserWrapper>
            </FivePlayerWrapper1>
            <FivePlayerWrapper2>
              <UserWrapper>
                {currentCount !== 0 ? (
                  <img
                    src="/images/rank-none.png"
                    alt=""
                  />
                ) : (
                  <img
                    src={rankImages[randomBoxGame.players[3].rank]}
                    alt=""
                  />
                )}
                {currentCount === 0 && (
                  <RewardWrapper>
                    {randomBoxGame.players[3].rewardRate * 100}
                    %
                  </RewardWrapper>
                )}
                <IdWrapper>
                  <SvgUser />
                  {playersBox[3].userReferral.user.id}
                </IdWrapper>
              </UserWrapper>
              <UserWrapper>
                {currentCount !== 0 ? (
                  <img
                    src="/images/rank-none.png"
                    alt=""
                  />
                ) : (
                  <img
                    src={rankImages[randomBoxGame.players[4].rank]}
                    alt=""
                  />
                )}
                {currentCount === 0 && (
                  <RewardWrapper>
                    {randomBoxGame.players[4].rewardRate * 100}
                    %
                  </RewardWrapper>
                )}
                <IdWrapper>
                  <SvgUser />
                  {playersBox[4].userReferral.user.id}
                </IdWrapper>
              </UserWrapper>
            </FivePlayerWrapper2>
            {currentCount > 0 && (
              <CountImg
                count={currentCount}
              >
                {currentCount}
              </CountImg>
            )}
          </GameContainer>
        );
      default:
        return (
          <PlayerContainer>
            <VsWrapper
              src="/images/game-background.png"
              alt=""
            />
          </PlayerContainer>
        );
    }
  }
  , [
    playerCount,
    currentCount,
    countImages,
  ]);

  return (
    <Wrapper
      onClick={handleContainerClick}
    >
      <BattleHeader>
        {`${monthlyNames[randomBoxGame.month - 1]} ${t('战斗')}`}
      </BattleHeader>
      {PlayerContainer}
      {winModalOpen && (
        <WinModal
          isModalOpen={winModalOpen}
          toggleModal={handleModalClose}
          days={randomBoxGame.delayDays}
          amount={Number(formatEther(randomBoxGame.prizeAmount))}
        />
      )}
      {loseModalOpen && (
        <LoseModal
          isModalOpen={loseModalOpen}
          toggleModal={handleModalClose}
          lottery="梅鸟"
        />
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  color: var(--font-color);
  padding: 1rem 1.25rem;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
`;

const BattleHeader = styled.div`
  color: var(--dark-sub2);
  text-align: center;
  font-family: "Noto Sans SC";
  font-size: 1.125rem;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  text-transform: uppercase;
  width: 100%;
  text-align: start;
`;

const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  position: relative;
  width: 100%;
  height: 32.5rem;
  background-color: white;
  margin-top : 2.5rem;
  border-radius: 5rem;
  border: 1rem solid transparent;
  background-image: linear-gradient(#16181A,#16181A),
  linear-gradient(90deg, #12B8FF 0%, #FF007A 100%, #FF007A 100.01%);
  background-origin:border-box; 
  background-clip:padding-box, border-box;
  box-sizing: border-box;
`;

const VsWrapper = styled.img`
  position: absolute;
  top: 50%;
  transform: translate(0%, -50%);
  width: 50%;
  height: auto;
`;

const CountImg = styled.div<{ count : number }>`
  position: absolute;
  top: 50%;
  transform: translate(0%, -50%);
  width: 7.5rem;
  height: 7.5rem;
  border-radius: 50%;
  background: linear-gradient(90deg, #12B8FF 0%, #FF007A 100%);
  border: 8px solid #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #FFF;
  font-family: Montserrat;
  font-size: ${props => props.count === 0 ? '4.25rem' : '4rem'};
  font-style: normal;
  font-weight: 700;
  line-height: 8rem; /* 100% */
  text-transform: uppercase;
`;

const UserWrapper = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;


  & > img {
    display: flex;
    width: 4rem;
    height: 4rem;
  }
`;

const IdWrapper = styled.div`
  color: #EFEFEF;
  text-align: center;
  font-family: "Noto Sans SC";
  font-size: 0.75rem;
  font-style: normal;
  font-weight: 400;
  line-height: 0.75rem;
  background: rgba(0, 0, 0, 0.60);
  padding: 0.25rem;

  & > svg {
    width: 0.75rem;
    height: 0.75rem;
    path {
      fill: #EFEFEF;
    }
  }
`;

const RewardWrapper = styled.div`
  background : linear-gradient(90deg, #597CF6 0%, #613795 100%);
  border-radius: 9999px;
  border: 1px solid var(--game-gold);
  color: var(--font-color);
  text-align: center;
  font-family: "Noto Sans SC";
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 500;
  line-height: 1.5rem;
  width: 5rem;
  margin-top: 0.25rem;
`;

const ThreePlayerWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 5rem;
`;

const FivePlayerWrapper1 = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding-bottom: 2rem;
`;

const FivePlayerWrapper2 = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
`;

export default BattleRoom;
