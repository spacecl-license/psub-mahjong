import { isAddress } from 'ethers/lib/utils';
import { TronWeb } from 'tronweb';
import { string } from 'yup';

export const addressSchema = string().test({
  name: 'is-address',
  skipAbsent: true,
  test: (value, ctx) => {
    if (!isAddress(value ?? '')) {
      return ctx.createError({ message: 'not address type.' });
    }
    return true;
  },
});

export const tronAddressSchema = string().test({
  name: 'is-tron-address',
  skipAbsent: true,
  test: (value, ctx) => {
    if (!TronWeb.isAddress(value ?? '')) {
      return ctx.createError({ message: 'not tron address type.' });
    }
    return true;
  },
});
