import { useFetcher, useLoaderData } from '@remix-run/react';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';

import SvgGame from '~/components/icons/game';
import SvgUser from '~/components/icons/user';
import BasicInput from '~/components/input/basic-input';
import UserProfile from '~/components/items/profile';
import BasicHeader from '~/components/section/basic-header';
import BasicSection from '~/components/section/basic-section';
import { useTheme } from '~/hooks/use-theme';
import { userReferralState, userState } from '~/recoil/atoms';

import FriendModal from './modal';
import type { loader } from './server';

export { loader, meta } from './server';

const Friend = () => {
  const user = useRecoilValue(userState);
  const userReferral = useRecoilValue(userReferralState);
  const [friendData, setFriendData] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const fetcher : any = useFetcher();
  const [gameStatusData, setGameStatusData] = useState<any>(null);
  // const [gameFriends, setGameFriends] = useState<any>(null);
  const [monthlyIndex, setMonthlyIndex] = useState(0);

  const { t } = useTranslation('friend');

  const {
    friends,
    // friendsChild,
  } = useLoaderData<typeof loader>();

  // 친구 목록을 홀수, 짝수 인덱스 기준으로 나누기
  const oddFriends = friends.filter((_: any, index: number) => index % 2 === 0);
  const evenFriends = friends.filter((_: any, index: number) => index % 2 !== 0);

  const nowFriends = friends.length;

  const [theme] = useTheme();

  const isLoading = fetcher.state === 'loading';

  const handleFriendClick = (friend: any) => {
    setFriendData(friend);
    const newUrl = `/my-page/friend?userReferralId=${friend._id}`;
    fetcher.load(newUrl);
    window.history.pushState('', '', newUrl);
  };

  const handleFriendFriendClick = (index : number) => {
    setModalOpen(true);
    setMonthlyIndex(index);
  };

  useEffect(() => {
    if (fetcher.data) {
      setGameStatusData(fetcher.data.gameStatus);
      // setGameFriends(fetcher.data.childFriends);
    }
  }, [fetcher.data]);

  // 친구데이터 분할
  const [gameStatusByLevel, setGameStatusByLevel] = useState<any>([]);
  // const [totalChildren, setTotalChildren] = useState(0);

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

  useEffect(() => {
    if (!isLoading){
      const gameStatusByLevel = monthlyNames.map((name, index) => {
        const levelData = gameStatusData?.find((data:any) => data._id === index + 1);
        return levelData || { level: index + 1, maxRound: '0', totalChildren: '0', lastChild : [] };
      });

      // const totalChildrenSum = gameStatusData?.reduce((acc: number, curr: any) => {
      //   return acc + (Number(curr.totalChildren) || 0);
      // }, 0) || 0;

      // setTotalChildren(totalChildrenSum);
      setGameStatusByLevel(gameStatusByLevel);
    }
  }, [gameStatusData, isLoading]);

  return (
    <Wrapper>
      <BasicHeader>MY FRIENDS</BasicHeader>
      <UserProfile
        user={user!}
        userReferral={userReferral!}
      />
      <FriendListWrapper>
        <BasicInput label={t('朋友')}>
          <FriendHeader
            className={clsx(['friend-border-bottom'])}
          >
            <div>
              {`now : ${nowFriends}`}
              <SvgUser />
            </div>
            {/* <div>
              {`Total : ${friendsChild + nowFriends} EA`}
            </div> */}
          </FriendHeader>
          <FriendsContainer >
            <Half
              className={clsx(['friend-border-right'])}
            >
              {oddFriends.map((friend: { user: { id: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Iterable<React.ReactNode> | null | undefined; }; }, index: React.Key | null | undefined) => (
                <FriendItem
                  key={index}
                  onClick={() => handleFriendClick(friend)}
                >
                  <ProfilePic
                    src="/images/basic-profile.png"
                    alt="Friend's Profile"
                  />
                  <FriendID>{friend.user.id}</FriendID>
                </FriendItem>
              ))}
            </Half>
            <Half>
              {evenFriends.map((friend: { user: { id: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Iterable<React.ReactNode> | null | undefined; }; }, index: React.Key | null | undefined) => (
                <FriendItem
                  key={index}
                  onClick={() => handleFriendClick(friend)}
                >
                  <ProfilePic
                    src="/images/basic-profile.png"
                    alt="Friend's Profile"
                  />
                  <FriendID>{friend.user.id}</FriendID>
                </FriendItem>
              ))}
            </Half>
          </FriendsContainer>
        </BasicInput>
      </FriendListWrapper>
      {friendData && (
        <BasicSection
          headerContent={friendData?.user?.id}
          headerProfile
        >
          <FriendDetailWrapper>
            <NftGroupContainer>
              {gameStatusByLevel.map(({
                level, maxRound, totalChildren, lastChild,
              }: { level: number, maxRound: string, totalChildren: string, lastChild : any }, index : number) => (
                <NftInformation
                  key={index}
                  onClick={() => handleFriendFriendClick(index)}
                  theme={theme}
                >
                  <div>
                    <div>
                      <div>
                        <SvgGame />
                        {monthlyNames[index]}
                      </div>
                      <div>
                        <div>
                          <ContentHeader>{`${totalChildren}L`}</ContentHeader>
                          <Content>
                            <div>
                              {maxRound}
                            </div>
                            <div>
                              {lastChild.length}
                            </div>
                          </Content>
                        </div>
                      </div>
                    </div>
                  </div>
                </NftInformation>
              ))}
            </NftGroupContainer>
          </FriendDetailWrapper>
        </BasicSection>
      )}
      <FriendModal
        isModalOpen={modalOpen}
        toggleModal={() => setModalOpen(!modalOpen)}
        friendData={friendData}
        monthlyIndex={monthlyIndex}
      />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
`;

const FriendsContainer = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;

  & > div:first-child {
    border-right: 1px solid var(--main-color);
    padding-right: 1rem;
  }
`;

const Half = styled.div`
  width: 50%;
  padding: 1rem;
`;

const FriendItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem; 
  cursor: pointer;
  
  :last-child {
    margin-bottom: 0;
  }
`;

const ProfilePic = styled.img`
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 50%;
  margin-right: 0.4rem;
`;

const FriendID = styled.span`
  flex: 1;
  font-family: "Noto Sans SC";
  font-size: 1rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.375rem;
  text-align: center;
  color: var(--font-color);
`;

const FriendListWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.25rem;

  & > div {
    padding: 0;
  }
  
  & > div > div {
    display: block;
  }
`;

const FriendHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid var(--main-color);

  & > div {
    display: flex;
    justify-content: center;
    align-items: center;
    color: var(--friend-color);
    text-align: end;
    font-family: Montserrat;
    font-size: 1rem;
    font-style: normal;
    font-weight: 400;
    line-height: 1rem;
    text-transform: uppercase;

    & > svg {
      margin-left: 0.5rem;
      width: 1.125rem;
      height: 1.125rem;
      vertical-align: top;

      path {
        fill: var(--friend-color);
      }
    }
  }
`;

const FriendDetailWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap : 1.5rem;
  padding: 1.5rem 1rem 2.5rem 1rem;
`;

const NftGroupContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const NftInformation = styled.div<{theme : string}>`
  margin-bottom: 1.5rem;
  border: 1px solid var(--friend-border);
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: ${({ theme }) => {
    if (theme === 'dark') {
      return '0px 0px 7px 0px rgba(18, 184, 255, 0.70)';
    } else {
      return 'none';
    }
  }
};

  & > div:first-child {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1.5rem;
    margin-bottom: 2.5rem;

    & > div {
      display: flex;
      flex-direction: column;
      flex: 1;

      & > div:first-child {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: var(--friend-color);
        font-size: 0.75rem;
        font-family: "Noto Sans SC";
        font-weight: 700;
        font-style: normal;
        line-height: 1rem; 
        text-transform: uppercase;
        color: white;
        width: 6rem;
        height: 2rem;
        padding: 0.5rem;

        & > svg {
          width: 1rem;
          height: 1rem;

          path {
            fill: white;
          }
        }
      }

      & > div:last-child {
        display: flex;
        flex-direction: column;
        /* border-bottom-left-radius: 0.5rem;
        border-bottom-right-radius: 0.5rem; */
        /* height: 3.25rem; */
      }
    }
  }

  & > div:last-child {
    margin-bottom: 0;

    & > span {
      top : -0.675rem;
    }
  }
`;

const ContentHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--friend-font-color);
  font-family: Montserrat;
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1rem;
  padding : 0.1rem; 
  border-bottom: 1px solid var(--friend-border);
`;

const Content = styled.div`
  display: flex;

  & > div:first-child {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0.44rem;
    color: var(--friend-font-color);
    text-align: center;
    font-family: Montserrat;
    font-size: 0.875rem;
    font-style: normal;
    font-weight: 700;
    line-height: 1rem;
    text-transform: uppercase;
    border-right: 1px solid var(--friend-border);
    width: 50%;
  }

  & > div:last-child {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0.44rem;
    color: var(--friend-font-color);
    text-align: center;
    font-family: Montserrat;
    font-size: 0.875rem;
    font-style: normal;
    font-weight: 700;
    line-height: 1rem;
    text-transform: uppercase;
    width: 50%;
  }
`;

export default Friend;
