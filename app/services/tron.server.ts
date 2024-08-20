/* eslint-disable no-nested-ternary */
import { json } from '@remix-run/node';

import { INVOICE_STATUS, TOKEN } from '~/common/constants';
import { NFTS } from '~/common/nfts';
import { InvoiceModel, ReceiptModel } from '~/models';
import type Invoice from '~/models/invoice';
import type UserAddress from '~/models/user-address';

import dbConnect from './db.server';
import { mintNft } from './scan.server';

export const checkTronUsdtDeposit = async () => {
  try {
    const depositAddress = process.env.DEPOSIT_TRON_ADDRESS;
    if (!depositAddress) throw Error('Please define the DEPOSIT_TRON_ADDRESS environment variable');

    await dbConnect();
    const invoices = await InvoiceModel.find<Invoice>({ status: 'pending' });

    const result = await fetch(
      `https://api.trongrid.io/v1/accounts/${depositAddress}/transactions/trc20?limit=100&contract_address=TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t`,
    );
    const { data } = await result.json();

    for (const invoice of invoices) {
      const tronAddress = (invoice.userAddress as any).tronAddress;

      const find =
        data.find((tx: any) => tx.from === tronAddress && tx.value === invoice.usdtPrice);

      if (find) {
        const nft = NFTS[`${invoice.level}月`];

        const receipt = await ReceiptModel.create({
          userAddress: invoice.userAddress,
          nft,
          token: TOKEN.USDT,
          paidAmount: find.value,
          chainNetworkId: 'tron',
          txHash: find.transaction_id,
        });

        invoice.receipt = receipt;
        invoice.status = INVOICE_STATUS.PAID;
        invoice.updatedAt = new Date();
        await (invoice as any).save();

        fetch(`http://127.0.0.1:3000/api/game/${invoice._id}`, { method: 'POST' });
        mintNft(invoice.level, (invoice.userAddress as UserAddress).bnbAddress);
      }
    }
    return json({});

  } catch (error) {
    console.error(error);
    return json<ErrorData>({ error }, { status: 500 });
  }
};
