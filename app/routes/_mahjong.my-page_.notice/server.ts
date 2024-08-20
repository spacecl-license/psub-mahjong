import { json, type LoaderFunction, type MetaFunction } from '@remix-run/node';

import type Notice from '~/models/notice';
import { getNotices, type GetNoticesArguments } from '~/services/notice.server';

export const meta: MetaFunction = () => {
  return [
    { title: 'PsuB NFT World' },
    {
      property: 'og:title',
      content: 'PsuB NFT World',
    },
    { name: 'description', content: 'Welcome to PsuB NFT World!' },
  ];
};

export interface LoaderData {
  options: GetNoticesArguments;
  notices: Notice[];
}

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url).searchParams;
  const data = Object.fromEntries(url);

  const options: GetNoticesArguments = {
    page: 1,
  };

  for (const key in data) {
    if (key == 'page') {
      options.page = parseInt(data[key]);
      continue;
    }
  }

  const notices = await getNotices({
    ...options,
  });

  return json<LoaderData>({
    options,
    notices,
  });
};
