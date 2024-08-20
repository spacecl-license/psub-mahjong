import { useFetcher } from '@remix-run/react';
import React from 'react';
import styled from 'styled-components';

import type User from '~/models/user';

import SvgLogout from '../icons/logout';

interface SettingProfileProps {
  user: User;
}

const SettingProfile: React.FC<SettingProfileProps> = ({ user }) => {

  const logoutFetcher = useFetcher();

  const handleLogout = () => {
    logoutFetcher.submit(null, { method: 'post', action: '/api/sign-out' });
  };

  return (
    <UserInfo>
      <div>
        <ProfileImage
          src="/images/basic-profile.png"
          alt="Profile"
        />
        <UserNameId>
          <div>
            {`${user.id}`}
          </div>
        </UserNameId>
      </div>
      <div onClick={handleLogout}>
        <SvgLogout />
        Logout
      </div>
    </UserInfo>
  );
};

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 1.25rem;
  background-color: var(--input-dark-sub2);

  & > div:first-child {
    display: flex;
    align-items: center;
  }

  & > div:last-child {
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    color: var(--font-color2);
    font-family: "Noto Sans SC";
    font-size: 0.75rem;
    font-style: normal;
    font-weight: 400;
    line-height: 0.75rem;
    gap: 0.25rem;

      & > svg {
      width: 1.5rem;
      height: 1.5rem;
      path {
        fill: var(--font-color2);
      }
    }
  }

`;

const UserNameId = styled.div`
  color: var(--font-color2);
  font-family: Inter;
  font-size: 1rem;
  font-style: normal;
  line-height: 1.5rem;
  margin-left: 1rem;
  font-weight: 700;

  svg {
    margin-left: 0.5rem;
    width: 1rem;
    height: 1rem;
    path {
      fill: var(--font-color2);
    }
  }

  & > div {
    color: var(--font-color2);
  }
`;

const ProfileImage = styled.img`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%; 
`;

export default SettingProfile;
