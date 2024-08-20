import { json } from '@remix-run/node';
import bcrypt from 'bcrypt';
import type { ObjectId } from 'mongoose';
import { object, string } from 'yup';

import { /* EMAIL_STATUS,  */REFERER_STATUS } from '~/common/constants';
// import { addressSchema/* , tronAddressSchema */ } from '~/common/schemas';
import {
  BoxModel,
  UserHashModel, UserLedgerModel, UserModel, UserReferralModel, UserTxHashModel, /*  VerificationModel, */
} from '~/models';
import type User from '~/models/user';
import type UserHash from '~/models/user-hash';
import type UserLedger from '~/models/user-ledger';
import type UserReferral from '~/models/user-referral';
import { validate } from '~/utils/utils.server';

import dbConnect from './db.server';
import { handleError, log } from './log.server';
import { getUser, signIn } from './session.server';

// * 회원 가입
export const register = async (request: Request) => {
  const formData = await request.formData();
  const payload = Object.fromEntries(formData);

  const schema = object({
    id: string().min(3).max(15).matches(/^[A-Za-z0-9]+$/, 'id must contain only letters and numbers').required(),
    password: string().min(8).max(30).matches(/^[^\s]+$/, 'password must not contain spaces').required(),
    checkPassword: string().min(8).max(30).required(),
    // transactionPassword: string().min(6).max(6).required(),
    // bnbAddress: addressSchema.required(),
    // tronAddress: tronAddressSchema.required(),
    // psubAddress: addressSchema.required(),
    referralCode: string().min(8).max(8).required(),
    // email: string().email().required(),
    // emailCode: string().min(3).max(15).required(),
  });

  const validateError = await validate(schema, payload);
  if (validateError) return validateError;

  if (payload.password !== payload.checkPassword) return json<ErrorData>({
    path: ['password', 'checkPassword'],
    error: 'password is not verified.',
  });

  try {
    await dbConnect();

    // 아이디 중복 확인
    const idExist = await UserModel.exists({ id: payload.id });

    if (idExist) {
      return json<ErrorData>({
        path: 'id',
        error: 'id duplicated.',
      }, { status: 403 });
    }

    // // BNB 주소의 중복 여부 확인
    // const bnbAddressExist = await UserAddressModel.exists({ bnbAddress: payload.bnbAddress });

    // if (bnbAddressExist) {
    //   return json<ErrorData>({
    //     path: 'bnbAddress',
    //     error: 'BNB address duplicated.',
    //   }, { status: 403 });
    // }

    // // PSUB 주소의 중복 여부 확인
    // const psubAddressExist = await UserAddressModel.exists({ psubAddress: payload.psubAddress });

    // if (psubAddressExist) {
    //   return json<ErrorData>({
    //     path: 'psubAddress',
    //     error: 'PSUB address duplicated.',
    //   }, { status: 403 });
    // }

    // const verification = await VerificationModel.findOne({
    //   email: payload.email,
    //   status: EMAIL_STATUS.WAITING,
    // }).sort({ createdAt: -1 });

    // // TODO: 이메일 코드 만료일 계산

    // if (!verification) {
    //   return json<ErrorData>({
    //     path: 'email',
    //     error: 'email code does not sended.',
    //   }, { status: 403 });
    // }

    // if (verification.code !== payload.emailCode) {
    //   return json<ErrorData>({
    //     path: 'emailCode',
    //     error: 'emailCode not matched.',
    //   }, { status: 403 });
    // }

    // verification.status = EMAIL_STATUS.VERIFIED;
    // verification.updatedAt = new Date();
    // await verification.save();

    const referral = await UserReferralModel.findOne<UserReferral>({
      referralCode: payload.referralCode,
    });

    if (!referral) {
      return json<ErrorData>({
        path: 'referralCode',
        error: 'referral is not exist.',
      }, { status: 403 });
    }

    if (referral.status === REFERER_STATUS.DISABLED) {
      return json<ErrorData>({
        path: 'referralCode',
        error: 'can not use this referral code.',
      }, { status: 403 });
    }

    let myReferralCode;

    while (!myReferralCode) {
      const uuid = crypto.randomUUID();
      const randomCode = uuid.split('-')[0];
      const exist = await UserReferralModel.exists({ referralCode: randomCode });
      if (exist) return;
      else myReferralCode = randomCode;
    }

    const hash =
      bcrypt.hashSync(payload.password as string, parseInt(process.env.SALT_ROUNDS ?? '10'));

    const user = await UserModel.create({
      id: payload.id,
      // email: payload.email,
      // emailVerification: verification,
    });

    await UserHashModel.create({
      user,
      hash,
    });
    // const userAddress = await UserAddressModel.create({
    //   user,
    //   bnbAddress: payload.bnbAddress,
    //   // tronAddress: payload.tronAddress,
    //   psubAddress: payload.psubAddress,
    // });

    const userReferral = await UserReferralModel.create({
      user,
      referralCode: myReferralCode,
      level: referral.level === 3 ? 2 : 1,
      status: REFERER_STATUS.DISABLED,
      referral,
    });

    const userLedger = await UserLedgerModel.create({
      user,
      psubBalance: '0',
    });

    const randomBox = await BoxModel.create({
      userReferral,
    });

    formData.delete('password');
    formData.delete('checkPassword');

    log({
      request,
      code: 'create-user',
      message: 'user created.',
      formData,
    });

    return json({
      user,
      // userAddress,
      userReferral,
      userLedger,
      randomBox,
    });

  } catch (error) {
    handleError({ request, error });
  }
};

// * 로그인
export const login = async (request: Request) => {
  const formData = await request.formData();
  const payload = Object.fromEntries(formData);

  const schema = object({
    id: string().min(3).max(15).required(),
    password: string().min(8).max(30).required(),
  });

  const validateError = await validate(schema, payload);
  if (validateError) return validateError;

  try {
    await dbConnect();
    const user = await UserModel.findOne<User>({ id: payload.id });

    if (!user) {
      return json<ErrorData>({
        path: 'id',
        error: 'user not founded.',
      }, { status: 403 });
    }

    const userHash = await UserHashModel.findOne<UserHash>({ user });

    if (!userHash) {
      return json<ErrorData>({
        path: 'userHash',
        error: 'user hash not founded.',
      }, { status: 403 });
    }

    const check = bcrypt.compareSync(payload.password as string, userHash.hash);

    formData.delete('password');

    if (check) {
      log({
        request,
        code: 'login-user',
        message: 'user login.',
        formData,
      });
      return signIn({ request, user });

    } else {
      return json<ErrorData>({
        path: 'password',
        error: 'password does not matched.',
      }, { status: 500 });
    }

  } catch (error) {
    handleError({ request, error });
  }
};

export const getUserReferralFromUser = async (user_id: ObjectId | string) => {
  await dbConnect();
  return UserReferralModel.findOne<UserReferral>({ user: user_id });
};

// 친구 조회
export const getUsersReferredByUser = async (referralId: ObjectId | string) => {
  await dbConnect();

  const referredUsers = await UserReferralModel.find({ referral: referralId });

  return referredUsers;
};

// 친구의 친구 수 조회
export const getReferredUsersAndTheirReferralsCount = async (referralId: ObjectId | string) => {
  await dbConnect();

  const referredUsersWithCounts = await UserReferralModel.aggregate([
    { $match: { referral: referralId } },
    { $lookup: {
      from: 'userreferrals',
      localField: '_id',
      foreignField: 'referral',
      as: 'referredFriends',
    } },
    { $unwind: '$referredFriends' },
    { $group: {
      _id: '$_id',
      totalReferredByReferral: { $sum: 1 },
    } },
    { $group: {
      _id: null,
      totalReferredByAll: { $sum: '$totalReferredByReferral' },
    } },
  ]);

  return referredUsersWithCounts.length > 0 ? referredUsersWithCounts[0].totalReferredByAll : 0;
};

export const getUserLedgerFromUser = async (user_id: ObjectId | string) => {
  await dbConnect();
  return UserLedgerModel.findOne<UserLedger>({ user: user_id });
};

export const updatedEmail= async (request: Request) => {
  const formData = await request.formData();
  const payload = Object.fromEntries(formData);

  try {
    await dbConnect();

    const user = await getUser(request);

    if (!user) {
      return json<ErrorData>({
        path: 'user',
        error: 'User not found.',
      }, { status: 403 });
    }

    const emailExist = await UserModel.exists({
      email: payload.email,
      _id: { $ne: user._id },
    });

    if (emailExist) {
      return json<ErrorData>({
        path: 'email',
        error: 'Email duplicated.',
      }, { status: 403 });
    }

    const updatedUser = await UserModel.findOneAndUpdate(
      { _id: user._id },
      {
        $set: {
          email: payload.email,
          updatedAt: Date.now(),
        },
      },
      {
        new: true,
      },
    );

    log({
      request,
      code: 'update-email',
      message: 'email updated.',
      formData,
    });

    return json({
      updatedUser,
      user,
    });

  } catch (error) {
    handleError({ request, error });
  }
};

export const updatedTransactionPassword = async (request: Request) => {
  const formData = await request.formData();
  const payload = Object.fromEntries(formData);

  const schema = object({
    transactionPassword: string().min(6).max(6).required(),
  });

  const validateError = await validate(schema, payload);
  if (validateError) return validateError;

  if (payload.transactionPassword !== payload.transactionPasswordCheck) return json<ErrorData>({
    path: ['transactionPassword', 'transactionPasswordCheck'],
    error: 'password is not verified.',
  });

  try {
    await dbConnect();

    const user = await getUser(request);

    if (!user) {
      return json({
        path: 'user',
        error: 'User not found.',
      }, { status: 403 });
    }

    const saltRounds = parseInt(process.env.SALT_ROUNDS ?? '10');
    const txHash = await bcrypt.hash(payload.transactionPassword as string, saltRounds);

    const updatedUser = await UserTxHashModel.findOneAndUpdate(
      { user: user._id },
      { $set: { hash: txHash, updatedAt: new Date() } },
      { new: true, upsert: true },
    );

    log({
      request,
      code: 'update-transaction-password',
      message: 'Transaction password updated.',
      formData,
    });

    return json({ updatedUser, user });
  } catch (error) {
    handleError({ request, error });
    return json({ error: 'Internal Server Error' }, { status: 500 });
  }
};
