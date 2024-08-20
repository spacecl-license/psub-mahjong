import {
  json, type LoaderFunction, type MetaFunction, redirect,
} from '@remix-run/node';
import type { ObjectId } from 'mongoose';

import type Notice from '~/models/notice';
import { getNoticeById } from '~/services/notice.server';

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
  notice: Notice;
}

export const loader: LoaderFunction = async ({ request, params }) => {
  const { _id } = params;

  if (!_id) {
    return redirect('/');
  }

  const notice = await getNoticeById(_id as unknown as ObjectId);

  if (!notice) {
    return redirect('/');
  }

  return json<LoaderData>({
    notice,
  });
};
