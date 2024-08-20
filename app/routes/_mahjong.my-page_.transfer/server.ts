import type { ActionFunction, LoaderFunction, MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';

import { UserAddressModel, UserTxHashModel } from '~/models';
import { getCoinPrice } from '~/services/coin.server';
import dbConnect from '~/services/db.server';
import { getLedgerBalance } from '~/services/ledger.server';
import { getUser } from '~/services/session.server';
import { sendTransaction } from '~/services/transfer.server';
// import { handleNotAllowedMethod } from '~/utils/utils.server';

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
  await dbConnect();
  const user = await getUser(request);
  const userAddress = await UserAddressModel.findOne({ user });
  const userTransactionPassword = await UserTxHashModel.findOne({ user });
  const psubBalance = await getLedgerBalance(user!._id!);

  const coinPrice = await getCoinPrice();

  return json({
    psubBalance,
    coinPrice,
    userAddress,
    userTransactionPassword,
  });
};

export const action: ActionFunction = async ({ request }) => {
  // TODO: 열어줄때 아래 코드 제거
  // return handleNotAllowedMethod();

  const formData = await request.formData();
  const user = await getUser(request);
  const recipientId = formData.get('recipientId') as string;
  const amount = formData.get('amount') as string;
  const transactionPassword = formData.get('transactionPassword') as string;
  const userId = user?._id;

  if (!recipientId) {
    return json({ error: 'Recipient user not found' }, { status: 400 });
  }

  if (!amount) {
    return json({ error: 'Invalid amount' }, { status: 400 });
  }

  if (!transactionPassword) {
    return json({ error: 'Please verify your transaction password' }, { status: 400 });
  }

  if (!userId) {
    return json({ error: 'not login' }, { status: 401 });
  }

  try {
    if (request.method === 'POST') {
      await sendTransaction(recipientId, userId!, amount, 5, transactionPassword);
      return json({ success: true });
    }
  } catch (error : any) {
    console.error(error);
    return json({ error: error.message }, { status: error.status });
  }
};
