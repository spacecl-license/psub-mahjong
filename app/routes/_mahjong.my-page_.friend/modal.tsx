import { useFetcher } from '@remix-run/react';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import BasicButton from '~/components/button/basic-button';
import SvgGame from '~/components/icons/game';
import LoadingDots from '~/components/items/loading';

type FriendModalProps = {
  isModalOpen: boolean;
  toggleModal: () => void;
  friendData?: any;
  monthlyIndex: number;
};

const FriendModal: React.FC<FriendModalProps> = ({
  isModalOpen, toggleModal, friendData, monthlyIndex,
}) => {
  const fetcher = useFetcher();
  const [isLoading, setIsLoading] = useState(true);
  const [friendsInfo, setFriendsInfo] = useState([]);

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
    if (isModalOpen && friendData && friendData._id && friendData.level) {
      setIsLoading(true);
      fetcher.load(`/api/friend?userReferral_id=${friendData._id}&level=${monthlyIndex + 1}`);
    }

  }, [isModalOpen, friendData]);

  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data) {
      setFriendsInfo((fetcher.data as any).friendsInfo);
      setIsLoading(false);
    }
  }, [fetcher]);

  return (
    <div>
      <ModalOverlay
        isOpen={isModalOpen}
        onClick={toggleModal}
      />
      <GuideModal isOpen={isModalOpen}>
        <ModalHeader>
          <div>
            <ProfilePic
              src="/images/basic-profile.png"
              alt="Friend's Profile"
            />
            {friendData?.user?.id}
          </div>
          <div>
            <SvgGame />
            {monthlyNames[monthlyIndex]}
          </div>
        </ModalHeader>
        <ModalContent>
          {isLoading ? (
            <LoadingWrapper>
              <LoadingDots />
            </LoadingWrapper>
          ): (
            <>
              {friendsInfo.map((friend, index) => (
                <FriendWrapper key={index}>
                  <div>
                    <ProfilePic
                      src="/images/basic-profile.png"
                      alt="Friend's Profile"
                    />
                    {(friend as any).id}
                  </div>
                  <div>
                    {`${(friend as any).light}L (${(friend as any).round}-${(friend as any).light})`}
                  </div>
                </FriendWrapper>
              ))}
              <ButtonWrapper>
                <BasicButton onClick={toggleModal}>CLOSE</BasicButton>
              </ButtonWrapper>
            </>
          )}
        </ModalContent>
      </GuideModal>
    </div>
  );
};

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
  background-color: var(--friend-modal-header-color);
  position: relative;
  & > div:first-child {
    color: white;
    font-family: Montserrat;
    font-size: 1rem;
    font-style: normal;
    font-weight: 700;
    line-height: 1rem;
    text-transform: uppercase;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  & > div:last-child {
    color: white;
    font-family: Montserrat;
    font-size: 1rem;
    font-style: normal;
    font-weight: 700;
    line-height: 1rem;
    text-transform: uppercase;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;

    & > svg {
      width: 1.2rem;
      height: 1.2rem;
      path {
        fill: white;
      }
    }
  }
`;

const ModalContent = styled.div`
  /* min-height : 20rem;  */
  max-height: 32rem;
  overflow-y: auto;
`;

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 20rem;
`;

const GuideModal = styled.div<{ isOpen: boolean }>`
  position: fixed; 
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 93%; 
  max-width: 31.25rem; 
  background-color: var(--bg-color);
  border-radius: 0.5rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  z-index: 1000; 
  display: ${props => props.isOpen ? 'block' : 'none'}; 
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

const ProfilePic = styled.img`
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 50%;
  margin-right: 0.4rem;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1.5rem;
  padding : 0 1rem;
  margin-bottom: 2.5rem;
`;

const FriendWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1.25rem;
  border-bottom: 1px solid var(--friend-modal-border-color);
  width: 100%;

  & > div:first-child {
    font-family: "Noto Sans SC";
    font-size: 1rem;
    font-style: normal;
    font-weight: 400;
    line-height: 1.375rem;
    display: flex;
    align-items: center;
    color: var(--font-color);
  }
  & > div:last-child {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    color: var(--friend-color);
    font-family: Montserrat;
    font-size: 1rem;
    font-style: normal;
    font-weight: 700;
    line-height: 1.375rem; 
  }
`;

export default FriendModal;
