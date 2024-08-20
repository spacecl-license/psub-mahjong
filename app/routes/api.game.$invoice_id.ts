import type { ActionFunction } from '@remix-run/node';

// import { generateGameByInvoice } from '~/services/game.server';
import { handleNotAllowedMethod } from '~/utils/utils.server';

export const action: ActionFunction = async ({ request, params }) => {
  // const { invoice_id } = params;

  switch (request.method) {
    // * POST: 게임 생성
    case 'POST': {
      // return generateGameByInvoice(request, invoice_id!);
      return handleNotAllowedMethod();
    }

    default: {
      return handleNotAllowedMethod();
    }
  }
};
