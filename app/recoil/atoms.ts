import { atom } from 'recoil';

import type User from '~/models/user';
import type UserReferral from '~/models/user-referral';

export const userState = atom<User | null>({
  key: 'userState',
  default: null,
});

export const userReferralState = atom<UserReferral | null>({
  key: 'userReferralState',
  default: null,
});

export const tabState = atom<string>({
  key: 'tabState',
  default: 'REWARDS',
});
