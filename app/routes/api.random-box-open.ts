import { type ActionFunction, redirectDocument } from '@remix-run/node';

import { openRandomBox } from '~/services/box.server';
import { getUser } from '~/services/session.server';
import { handleNotAllowedMethod } from '~/utils/utils.server';

export const action: ActionFunction = async ({ request }) => {
  const user = await getUser(request);
  const formData = await request.formData();
  const level = formData.get('level') as string;
  const amount = Number(formData.get('quantity'));

  switch (request.method) {
    // * POST: 리워드 교환
    case 'POST': {
      await openRandomBox(request, user!._id!, Number(level), amount);
      return redirectDocument('/my-page/my-reward');
    }

    default: {
      return handleNotAllowedMethod();
    }
  }
};
