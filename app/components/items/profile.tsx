import { Link } from '@remix-run/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import SvgCopy from '~/components/icons/copy';
import type User from '~/models/user';
import type UserReferral from '~/models/user-referral';

import SvgSetting from '../icons/setting';

interface UserProfileProps {
  user: User;
  userReferral: UserReferral;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, userReferral }) => {
  const { t } = useTranslation('my-page');

  const handleCopy = (id : string) => {
    navigator.clipboard.writeText(id);
    alert('Copied to clipboard.');
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
            {`${t('ID号')} : ${user.id}`}
            <SvgCopy onClick={() => handleCopy(user.id)} />
          </div>
          <div>
            {`${t('推荐人ID')} : ${((userReferral!.referral as UserReferral).user as User).id}`}
          </div>
        </UserNameId>
      </div>
      <Link to="/my-page/setting">
        <SvgSetting />
      </Link>

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

  & > a:last-child {
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
  font-weight: 400;
  line-height: 1.5rem;
  margin-left: 1rem;

  & > div:first-child {
    display: flex;
    align-items: top;
  }

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

export default UserProfile;
