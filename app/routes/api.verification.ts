import type { ActionFunction } from '@remix-run/node';

import { sendCode } from '~/services/email.server';
import { handleNotAllowedMethod } from '~/utils/utils.server';

export const action: ActionFunction = async ({ request }) => {

  switch (request.method) {
    // * POST: 인증 코드 발송 및 등록
    case 'POST': {
      return sendCode(request);
    }

    default: {
      return handleNotAllowedMethod();
    }
  }
};
