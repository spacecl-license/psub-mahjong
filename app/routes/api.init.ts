/* eslint-disable array-element-newline */
// TODO: 데이터 초기화를 위한 라우터. 불필요시 삭제할 것

import { json, type LoaderFunction } from '@remix-run/node';
import { Types } from 'mongoose';

import { EMAIL_STATUS, MASTER_CODE, REFERER_STATUS } from '~/common/constants';
import { UserModel, UserReferralModel, VerificationModel } from '~/models';
import dbConnect from '~/services/db.server';

export const loader: LoaderFunction = async ({ request }) => {
  await dbConnect();

  const masterData = await Promise.all([
    UserModel.findOne({ id: 'master' }),
    UserReferralModel.findOne({ referralCode: MASTER_CODE }),
  ]);

  if (masterData[0] || masterData[1]) {
    console.error('already initialized.');
    return json({});
  }

  const verification = await VerificationModel.create({
    email: 'contact@psub.io',
    code: MASTER_CODE,
    status: EMAIL_STATUS.VERIFIED,
  });

  const master = await UserModel.create({
    id: 'master',
    email: 'contact@psub.io',
    emailVerification: verification,
    isAdmin: true,
  });

  const masterRefferal = await UserReferralModel.create({
    user: master,
    referralCode: MASTER_CODE,
    level: 3,
    status: REFERER_STATUS.ENABLED,
    referral: new Types.ObjectId(),
  });
  masterRefferal.referral = masterRefferal._id;
  await masterRefferal.save();

  console.info('master generated.');

  return json({});
};
