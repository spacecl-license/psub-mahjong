import type {  LoaderFunction,  MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';

import { getUserGameStatus } from '~/services/friend.serve';
import { getUser } from '~/services/session.server';
import { getReferredUsersAndTheirReferralsCount, getUserReferralFromUser, getUsersReferredByUser  } from '~/services/user.server';

export const meta: MetaFunction = () => {
  return [
    { title: 'PsuB NFT World' },
    {
      property: 'og:title',
      content: 'PsuB NFT World',
    },
    { name: 'description', content: 'Welcome to PsuB NFT World!' },
  ];
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const userReferralId = url.searchParams.get('userReferralId');
  const user = await getUser(request);
  const userReferral = await getUserReferralFromUser(user!._id!);

  const friends = await getUsersReferredByUser(userReferral!._id!);
  const friendsChild = await getReferredUsersAndTheirReferralsCount(userReferral!._id!);

  const gameStatus = await getUserGameStatus(userReferralId!);
  const childFriends = await getUsersReferredByUser(userReferralId!);

  return json({
    friends: friends ? friends : [],
    gameStatus,
    childFriends,
    friendsChild,
  });
};
