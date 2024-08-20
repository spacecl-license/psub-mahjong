import { type ActionFunction } from '@remix-run/node';

import { updatePlayerSeenCount } from '~/services/box-betting.server';

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const boxId = formData.get('randomBoxGameId');

  if (!boxId) {
    return console.error('boxId must required.');
  }

  switch (request.method) {
    // * POST: 인증 코드 발송 및 등록
    case 'POST': {
      return updatePlayerSeenCount(boxId.toString());
    }

    default: {
      return console.error('logout not allowed.');
    }
  }
};
