
import { json, type LoaderFunction } from '@remix-run/node';

import { checkBnbDeposit, checkPsuBDeposit, checkUsdtDeposit } from '~/services/scan.server';

export const loader: LoaderFunction = async ({ request }) => {
  const authHeader = request.headers.get('authorization');

  if (
    !process.env.CRON_SECRET ||
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return json<ErrorData>({
      path: 'authorization',
      error: 'authorization error',
    }, { status: 401 });
  }

  checkBnbDeposit(request);
  checkUsdtDeposit(request);
  checkPsuBDeposit(request);

  return json({});
};
