import type { ActionFunction, LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';

import type Notice from '~/models/notice';
import type { GetNoticesArguments } from '~/services/notice.server';
import { getNotices } from '~/services/notice.server';
import { handleNotAllowedMethod, parseFormBodyData } from '~/utils/utils.server';

export const loader: LoaderFunction = async ({ request }) => {
  return handleNotAllowedMethod();
};

export interface NoticesActionData {
  options: GetNoticesArguments;
  notices: Notice[];
}

export const action: ActionFunction = async ({ request }) => {
  switch (request.method) {
    case 'POST':
      const formData = await request.formData();

      // TODO: validation
      const { page } = parseFormBodyData(formData);

      const options: GetNoticesArguments = {
        page: page ?? 1,
      };

      const notices = await getNotices({
        ...options,
      });

      return json<NoticesActionData>({
        options,
        notices,
      });

    default:
      return handleNotAllowedMethod();
  }
};
