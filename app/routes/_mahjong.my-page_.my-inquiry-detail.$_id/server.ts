import {
  json, type LoaderFunction, type MetaFunction, redirect,
} from '@remix-run/node';

import { getUserAskInquiryById } from '~/services/inquiry.server';

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

export const loader: LoaderFunction = async ({ request, params }) => {
  const { _id } = params;

  if (!_id) {
    return redirect('/');
  }

  const inquiry = await getUserAskInquiryById(_id);

  if (!inquiry) {
    return redirect('/');
  }

  return json({
    inquiry,
  });
};
