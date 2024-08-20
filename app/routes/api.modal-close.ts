import { type ActionFunction } from '@remix-run/node';

import { removeShowModal } from '~/services/session.server';

export const action: ActionFunction = async ({ request }) => {

  switch (request.method) {
    // * POST: 인증 코드 발송 및 등록
    case 'POST': {
      return removeShowModal(request);
    }

    default: {
      return console.error('logout not allowed.');
    }
  }
};
