import { json, type LoaderFunction, type MetaFunction } from '@remix-run/node';

import { getShowModal } from '~/services/session.server';

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

export const loader: LoaderFunction = async ({ request }) => {
  const modalOpen = await getShowModal(request);

  return json({
    modalOpen,
  });

};
