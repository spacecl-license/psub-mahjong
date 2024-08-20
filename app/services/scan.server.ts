/* eslint-disable no-nested-ternary */
import { json } from '@remix-run/node';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';
import { Contract, ethers, providers } from 'ethers';
import { getAddress, parseEther } from 'ethers/lib/utils.js';

import { INVOICE_STATUS, TOKEN } from '~/common/constants';
import { ERC_20_ABI } from '~/common/erc20';
import { NFTS } from '~/common/nfts';
import { InvoiceModel, ReceiptModel, UserAddressModel } from '~/models';
import type Invoice from '~/models/invoice';
// import type User from '~/models/user';
import type UserAddress from '~/models/user-address';

import dbConnect from './db.server';
// import { sendClaimedNftInfo } from './email.server';
import { generateGameByInvoice } from './game.server';
import { handleError } from './log.server';

const PSUB_CA = '0x19c0d5ddcf06f282e7a547d25ab09fe5a7984aae';
const T_PSUB_CA = '0xD714F2C851b0BD83d183E68F8F34de0819E66096';
const USDT_BCA = '0x55d398326f99059fF775485246999027B3197955';

export const checkBnbDeposit = async (request: Request) => {
  try {
    const depositAddress = process.env.DEPOSIT_WALLET_ADDRESS;
    if (!depositAddress) throw Error('Please define the DEPOSIT_TRON_ADDRESS environment variable');

    await dbConnect();
    const invoices = await InvoiceModel.find<Invoice>({ status: 'pending' });

    const res = await fetch(
      `https://api.bscscan.com/api?module=account&action=txlist&address=${depositAddress}&startblock=0&endblock=99999999&page=1&offset=100&sort=desc&apikey=7W1F68BCHIAI32EXV8NYQ9Z3HA2PTH4YCU`,
    );
    const { result } = await res.json();

    for (const invoice of invoices) {
      const bnbAddress = getAddress((invoice.userAddress as UserAddress).bnbAddress);

      const find =
        result.find(
          (tx: any) => getAddress(tx.from) === bnbAddress && tx.value === invoice.bnbPrice,
        );

      if (find) {
        const exists = await ReceiptModel.exists({
          chainNetworkId: 'bsc',
          txHash: find.hash,
        });
        if (exists) continue;

        console.info('find sended bnb transaction', find.hash);
        const nft = NFTS[`${invoice.level}月`];

        const receipt = await ReceiptModel.create({
          userAddress: invoice.userAddress,
          nft,
          token: TOKEN.BNB,
          paidAmount: find.value,
          chainNetworkId: 'bsc',
          txHash: find.hash,
        });

        invoice.receipt = receipt;
        invoice.status = INVOICE_STATUS.PAID;
        invoice.updatedAt = new Date();
        await (invoice as any).save();

        // fetch(`http://127.0.0.1:3000/api/game/${invoice._id}`, { method: 'POST' });
        generateGameByInvoice(request, invoice!._id!);
        mintNft(invoice.level, (invoice.userAddress as UserAddress).bnbAddress);
      }
    }
    return json({});

  } catch (error) {
    handleError({ request, error });
  }
};

export const checkUsdtDeposit = async (request: Request) => {
  try {
    const depositAddress = process.env.DEPOSIT_WALLET_ADDRESS;
    if (!depositAddress) throw Error('Please define the DEPOSIT_TRON_ADDRESS environment variable');

    await dbConnect();
    const invoices = await InvoiceModel.find<Invoice>({ status: 'pending' });

    const res = await fetch(
      `https://api.bscscan.com/api?module=account&action=tokentx&address=${depositAddress}&startblock=0&endblock=99999999&page=1&offset=10&sort=asc&contractaddress=${USDT_BCA}&apikey=7W1F68BCHIAI32EXV8NYQ9Z3HA2PTH4YCU`,
    );
    const { result } = await res.json();

    for (const invoice of invoices) {
      const bnbAddress = getAddress((invoice.userAddress as UserAddress).bnbAddress);

      const find =
        result.find(
          (tx: any) => getAddress(tx.from) === bnbAddress && tx.value === invoice.usdtPrice,
        );

      if (find) {
        const exists = await ReceiptModel.exists({
          chainNetworkId: 'bsc',
          txHash: find.hash,
        });
        if (exists) continue;

        console.info('find sended usdt transaction', find.hash);
        const nft = NFTS[`${invoice.level}月`];

        const receipt = await ReceiptModel.create({
          userAddress: invoice.userAddress,
          nft,
          token: TOKEN.USDT,
          paidAmount: find.value,
          chainNetworkId: 'bsc',
          txHash: find.hash,
        });

        invoice.receipt = receipt;
        invoice.status = INVOICE_STATUS.PAID;
        invoice.updatedAt = new Date();
        await (invoice as any).save();

        generateGameByInvoice(request, invoice!._id!);
        mintNft(invoice.level, (invoice.userAddress as UserAddress).bnbAddress);
      }
    }
    return json({});

  } catch (error) {
    handleError({ request, error });
  }
};

export const checkPsuBDeposit = async (request: Request) => {
  try {
    const depositAddress = process.env.DEPOSIT_WALLET_ADDRESS;
    if (!depositAddress) throw Error('Please define the DEPOSIT_TRON_ADDRESS environment variable');

    await dbConnect();
    const invoices = await InvoiceModel.find<Invoice>({ status: 'pending' });

    const res = await fetch(
      `https://www.oklink.com/api/v5/explorer/token/transaction-list?chainShortName=KLAYTN&tokenContractAddress=${PSUB_CA}&limit=50`,
      {
        headers: {
          'Ok-Access-Key': 'eb7be2aa-8d78-4e62-bb34-8e6a4db22d9a',
        },
      },
    );
    const { data } = await res.json();

    for (const invoice of invoices) {
      const psubAddress = getAddress((invoice.userAddress as UserAddress).psubAddress);

      const find =
        data[0].transactionList.find(
          (tx: any) => {
            return getAddress(tx.from) === psubAddress &&
              parseEther(tx.amount).toString() === invoice.psubPrice &&
              tx.methodId === '0xa9059cbb';
          },
        );

      if (find) {
        const exists = await ReceiptModel.exists({
          chainNetworkId: 'klaytn',
          txHash: find.txid,
        });
        if (exists) continue;

        console.info('find sended psub transaction', find.txid);
        const nft = NFTS[`${invoice.level}月`];

        const receipt = await ReceiptModel.create({
          userAddress: invoice.userAddress,
          nft,
          token: TOKEN.PSUB,
          paidAmount: parseEther(find.amount).toString(),
          chainNetworkId: 'klaytn',
          txHash: find.txid,
        });

        invoice.receipt = receipt;
        invoice.status = INVOICE_STATUS.PAID;
        invoice.updatedAt = new Date();
        await (invoice as any).save();

        generateGameByInvoice(request, invoice!._id!);
        mintNft(invoice.level, (invoice.userAddress as UserAddress).bnbAddress);
      }
    }
    return json({});

  } catch (error) {
    handleError({ request, error });
  }
};

// const ethereumProvider = new providers.JsonRpcProvider({
//   url: 'https://1.rpc.thirdweb.com',
// });

const klaytnProvider = new providers.JsonRpcProvider({
  url: 'https://klaytn.blockpi.network/v1/rpc/public',
});

const baobabProvider = new providers.JsonRpcProvider({
  url: 'https://api.baobab.klaytn.net:8651',
});

const bscProvider = new providers.JsonRpcProvider({
  url: 'https://rpc.ankr.com/bsc',
});

const tPsuB = new Contract(T_PSUB_CA, ERC_20_ABI, baobabProvider);
const PsuB = new Contract(PSUB_CA, ERC_20_ABI, klaytnProvider);
const USDT = new Contract(USDT_BCA, ERC_20_ABI, bscProvider);

let isWatch = false;

// * 토큰 전송 확인
export const watchTokens = async (request: Request) => {
  try {
    console.info('isWatch', isWatch);
    if (!isWatch) await listenTokens(request);

    return json({
      isWatch,
    });

  } catch (error) {
    handleError({ request, error });
  }
};

const listenTokens = async (request: Request) => {
  const depositAddress = process.env.DEPOSIT_WALLET_ADDRESS;
  if (!depositAddress) throw Error('Please define the DEPOSIT_TRON_ADDRESS environment variable');

  try {
    // * 개발계일 때 tPsuB watch
    if (process.env.NODE_ENV === 'development') {
      console.info('watch test psub...');

      tPsuB.on('*', async (e) => {
        console.info('new test psub transaction', e.transactionHash);

        switch (e.event) {
          case 'Transfer':
            const from = getAddress(e.args.from);
            const to = getAddress(e.args.to);
            const value = e.args.value.toString();

            if (to === depositAddress) {
              await dbConnect();

              const userAddress = await UserAddressModel.findOne({
                psubAddress: from,
              });

              if (!userAddress) return;

              const invoices = await InvoiceModel.find({
                userAddress,
                psubPrice: value,
                status: INVOICE_STATUS.PENDING,
              }).sort({ createdAt: 1 });

              if (invoices && invoices.length > 0) {
                const invoice  = await InvoiceModel.findById(invoices[0]._id);
                const nft = NFTS[`${invoice.level}月`];

                const receipt = await ReceiptModel.create({
                  userAddress,
                  nft,
                  token: TOKEN.T_PSUB,
                  paidAmount: value,
                  chainNetworkId: 'baobab',
                  txHash: e.transactionHash,
                });

                invoice.receipt = receipt;
                invoice.status = 'paid';
                invoice.updatedAt = new Date();
                await invoice.save();

                fetch(`http://127.0.0.1:3000/api/game/${invoice._id}`, { method: 'POST' });
                generateGameByInvoice(request, invoice!._id!);
                mintNft(invoice.level, invoice.userAddress.bnbAddress);
              }
            }
            break;

          default:
            break;
        }
      });

    } else {
      console.info('watch psub and bsc usdt...');

      // * PsuB watch
      PsuB.on('*', async (e) => {
        console.info('new psub transaction', e.transactionHash);

        switch (e.event) {
          case 'Transfer':
            const from = getAddress(e.args.from);
            const to = getAddress(e.args.to);
            const value = e.args.value.toString();

            if (to === depositAddress) {
              await dbConnect();

              const userAddress = await UserAddressModel.findOne({
                psubAddress: from,
              });

              if (!userAddress) return;

              const invoices = await InvoiceModel.find({
                userAddress,
                psubPrice: value,
                status: 'pending',
              }).sort({ createdAt: 1 });

              if (invoices && invoices.length > 0) {
                const invoice  = await InvoiceModel.findById(invoices[0]._id);
                const nft = NFTS[`${invoice.level}月`];

                const receipt = await ReceiptModel.create({
                  userAddress,
                  nft,
                  token: 'PsuB',
                  paidAmount: value,
                  chainNetworkId: 'klaytn',
                  txHash: e.transactionHash,
                });

                invoice.receipt = receipt;
                invoice.status = 'paid';
                invoice.updatedAt = new Date();
                await invoice.save();

                generateGameByInvoice(request, invoice!._id!);
                mintNft(invoice.level, invoice.userAddress.bnbAddress);
              }
            }
            break;

          default:
            break;
        }
      });

      // * USDT(BSC) watch
      USDT.on('*', async (e) => {
        switch (e.event) {
          case 'Transfer':
            const from = getAddress(e.args.from);
            const to = getAddress(e.args.to);
            const value = e.args.value.toString();

            if (to === depositAddress) {
              await dbConnect();

              const userAddress = await UserAddressModel.findOne({
                bnbAddress: from,
              });

              if (!userAddress) return;

              const invoices = await InvoiceModel.find({
                userAddress,
                usdtPrice: value,
                status: 'pending',
              }).sort({ createdAt: 1 });

              if (invoices && invoices.length > 0) {
                const invoice  = await InvoiceModel.findById(invoices[0]._id);
                const nft = NFTS[`${invoice.level}月`];

                const receipt = await ReceiptModel.create({
                  userAddress,
                  nft,
                  token: 'USDT',
                  paidAmount: value,
                  chainNetworkId: 'bsc',
                  txHash: e.transactionHash,
                });

                invoice.receipt = receipt;
                invoice.status = 'paid';
                invoice.updatedAt = new Date();
                await invoice.save();

                generateGameByInvoice(request, invoice!._id!);
                mintNft(invoice.level, invoice.userAddress.bnbAddress);
              }
            }
            break;

          default:
            break;
        }
      });
    }

    isWatch = true;

  } catch (error) {
    isWatch = false;
    console.error(error);
    tPsuB.removeAllListeners();
    PsuB.removeAllListeners();

    setTimeout(() => {
      console.info('retry listen to contract events...');
      listenTokens(request);
    }, 3000);
  }
};

export const mintNft = async (level: number, toAddress: string) => {
  try {
    const JAN_ADDRESS = '0x1eA36d3517f0a345652bda35eA8108BDC749Aa37';
    const FEB_ADDRESS = '0x919f5BBEaDEd045fcbe71F968ddB51c7E748e616';
    const MAR_ADDRESS = '0xecC35c0e3Fe60E52e7F6cF8f35cBaC3689122dE9';
    const APR_ADDRESS = '0x88Bcb119832Cd45b6E8dF7FE330eFd8f1F8291D3';
    const MAY_ADDRESS = '0x611B05D57495a91C63fc1E5a76fb3009925ca168';
    const JUN_ADDRESS = '0x0F8E7BEe133Be7495BeF6e9B18ae511b53A52005';
    const JUL_ADDRESS = '0x26F183D03924371f4d5C9B64E97c07AC458853c7';

    const bscProvider = new providers.JsonRpcProvider({
      url: 'https://bsc-dataseed.binance.org/',
    });

    const account = new ethers.Wallet(process.env.PRIVATE_KEY ?? '');
    const signer = account.connect(bscProvider);

    const thirdwebSDK = ThirdwebSDK.fromSigner(signer);

    let contractAddress;

    switch (level) {
      case 1:
        contractAddress = JAN_ADDRESS;
        break;
      case 2:
        contractAddress = FEB_ADDRESS;
        break;
      case 3:
        contractAddress = MAR_ADDRESS;
        break;
      case 4:
        contractAddress = APR_ADDRESS;
        break;
      case 5:
        contractAddress = MAY_ADDRESS;
        break;
      case 6:
        contractAddress = JUN_ADDRESS;
        break;
      case 7:
        contractAddress = JUL_ADDRESS;
        break;
      default:
        contractAddress = JAN_ADDRESS;
        break;
    }
    const contract = await thirdwebSDK.getContract(contractAddress);
    const result = await contract.erc721.claimTo(toAddress, 1);
    console.info('nft', level, (result as any).receipt?.transactionHash);

    // await dbConnect();
    // const userAddress = await UserAddressModel.findOne<UserAddress>({ bnbAddress: toAddress });

    // if (userAddress) {
    //   sendClaimedNftInfo(
    //     (userAddress.user as User).email,
    //     (result as any).receipt?.transactionHash ?? '',
    //   );
    // }

  } catch (error) {
    console.error(error);
  }
};
