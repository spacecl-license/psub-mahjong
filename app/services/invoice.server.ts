import { json } from '@remix-run/node';
import { parseEther/* , parseUnits */ } from 'ethers/lib/utils';

import { INVOICE_STATUS, TOKEN } from '~/common/constants';
import { InvoiceModel, UserAddressModel } from '~/models';

import dbConnect from './db.server';
import { getGames } from './game.server';
import { handleError, log } from './log.server';
import { getUser } from './session.server';
import { getUserReferralFromUser } from './user.server';

export const purchaseGameBySend = async (request: Request, nft: Nft) => {
  try {
    if (nft.level > 3) {
      return json<ErrorData>({
        path: 'invoice',
        error: 'can not buy game greater than level 3.',
      }, { status: 403 });
    }

    const formData = await request.formData();
    const token = formData.get('token');

    if (!token) {
      return json<ErrorData>({
        path: 'token',
        error: 'token must required.',
      }, { status: 400 });
    }

    await dbConnect();

    const user = await getUser(request);
    const userAddress = await UserAddressModel.findOne({ user });

    const packageExists = await InvoiceModel.exists({
      userAddress,
      level: 0,
      status: INVOICE_STATUS.PENDING,
    }).sort({ createdAt: 1 });

    const exists = await InvoiceModel.exists({
      userAddress,
      level: nft.level,
      status: INVOICE_STATUS.PENDING,
    }).sort({ createdAt: 1 });

    if (packageExists || exists) {
      return json<ErrorData>({
        path: 'invoice',
        error: 'can not create invoice.',
      }, { status: 403 });
    }

    const userReferral = await getUserReferralFromUser(user!._id!);

    const game = await getGames({
      userReferral_id: userReferral!._id!,
      level: nft.level,
    });

    if (game.length > 0) {
      return json<ErrorData>({
        path: 'game',
        error: 'can not create invoice.',
      }, { status: 403 });
    }

    const invoice = await InvoiceModel.create({
      userAddress,
      level: nft.level,
      round: 1,
      psubPrice: parseEther(nft.price[TOKEN.PSUB].toString()),
      bnbPrice: parseEther(nft.price[TOKEN.BNB].toString()),
      // usdtPrice: parseUnits(nft.price[TOKEN.USDT].toString(), 6),
      usdtPrice: parseEther(nft.price[TOKEN.USDT].toString()), // * 바이낸스 테더 소수점 18자리
    });

    log({
      request,
      code: 'create-invoice',
      message: `level ${nft.level} game invoice created.`,
      formData,
    });

    return json({
      invoice,
    });

  } catch (error) {
    handleError({ request, error });
  }
};
