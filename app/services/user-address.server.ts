import { json } from '@remix-run/node';

import { UserAddressModel } from '~/models';

import dbConnect from './db.server';
import { handleError, log } from './log.server';
import { getUser } from './session.server';

// * 주소 생성
export const createAddress = async (request: Request) => {
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

    // BNB 주소의 중복 여부 확인
    const bnbAddressExist = await UserAddressModel.exists({
      bnbAddress: payload.bnbAddress,
      user: { $ne: user._id },
    });

    if (bnbAddressExist) {
      return json<ErrorData>({
        path: 'bnbAddress',
        error: 'BNB address duplicated.',
      }, { status: 403 });
    }

    // PSUB 주소의 중복 여부 확인
    const psubAddressExist = await UserAddressModel.exists({
      psubAddress: payload.psubAddress,
      user: { $ne: user._id },
    });

    if (psubAddressExist) {
      return json<ErrorData>({
        path: 'psubAddress',
        error: 'PSUB address duplicated.',
      }, { status: 403 });
    }

    // 주소 업데이트 또는 새로운 주소 생성
    const userAddress = await UserAddressModel.findOneAndUpdate(
      { user: user._id },
      {
        $set: {
          user,
          bnbAddress: payload.bnbAddress,
          psubAddress: payload.psubAddress,
          updatedAt: Date.now(),
        },
      },
      {
        new: true,
        upsert: true,
      },
    );

    log({
      request,
      code: 'create-address',
      formData,
    });

    return json({
      user,
      userAddress,
    });

  } catch (error) {
    handleError({ request, error });
  }
};
