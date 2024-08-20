import type { ObjectId } from 'mongoose';

import { UserRankModel, UserReferralModel } from '~/models';

import dbConnect from './db.server';

// 사용자의 랭크와 하위 사용자들을 찾는 함수
export const findUserRank = async (userId: ObjectId) => {
  await dbConnect();
  const userReferral = await UserReferralModel.findOne({ user: userId }).populate('user');

  if (!userReferral) {
    throw new Error('UserReferral not found for the given user ID');
  }

  const userRank = await UserRankModel.findOne({ userReferral: userReferral._id });

  if (!userRank) {
    throw new Error('UserRank not found for the given user ID');
  }

  return {
    id: userReferral._id,
    user: userReferral.user,
    rank: userRank.rank,
    child: 0,
    name: userReferral.user.id,
    salesAmount: userRank.salesAmount,
    incomeAmount: userRank.incomeAmount,
  };
};

export const findSubReferrals = async (referralId: ObjectId, level: number) => {
  await dbConnect();
  const subReferrals = await UserReferralModel.find({ referral: referralId }).populate('user');
  const subRanks = [];

  for (const subReferral of subReferrals) {
    const subUserRank = await UserRankModel.findOne({ userReferral: subReferral._id });

    if (subUserRank) {
      subRanks.push({
        id: subReferral._id,
        rank: subUserRank.rank,
        child: level,
        name: subReferral.user.id,
        salesAmount: subUserRank.salesAmount,
        incomeAmount: subUserRank.incomeAmount,
      });
    }
  }

  return subRanks;
};
