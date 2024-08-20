import { json } from '@remix-run/node';
import { parseEther/* , parseUnits */ } from 'ethers/lib/utils';

import { INVOICE_STATUS } from '~/common/constants';
import { ChargeInvoiceModel, UserAddressModel } from '~/models';

import dbConnect from './db.server';
import { handleError, log } from './log.server';
import { getUser } from './session.server';

export const createChargeInvoice = async (request: Request) => {
  try {
    const formData = await request.formData();
    const token = formData.get('token');
    const quantity = formData.get('quantity');

    if (!token) {
      return json<ErrorData>({
        path: 'token',
        error: 'token must required.',
      }, { status: 400 });
    }

    if (!quantity) {
      return json<ErrorData>({
        path: 'quantity',
        error: 'quantity must required.',
      }, { status: 400 });
    }

    if (parseFloat(quantity as string) <= 0) {
      return json<ErrorData>({
        path: 'quantity',
        error: 'quantity must greater than zero.',
      }, { status: 400 });
    }

    await dbConnect();

    const user = await getUser(request);
    const userAddress = await UserAddressModel.findOne({ user });

    const exists = await ChargeInvoiceModel.exists({
      userAddress,
      token,
      status: INVOICE_STATUS.PENDING,
    }).sort({ createdAt: 1 });

    if (exists) {
      return json<ErrorData>({
        path: 'invoice',
        error: 'already requested this token.',
      }, { status: 403 });
    }

    const invoice = await ChargeInvoiceModel.create({
      userAddress,
      token,
      quantity: parseEther(quantity as string),
    });

    log({
      request,
      code: 'create-charge-invoice',
      message: `${quantity} ${token} invoice created.`,
      formData,
    });

    return json({
      invoice,
    });

  } catch (error) {
    handleError({ request, error });
  }
};
