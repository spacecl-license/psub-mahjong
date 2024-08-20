import { json, type LoaderFunction, type MetaFunction } from '@remix-run/node';

import { getAllInquiries } from '~/services/inquiry.server';
import { getUser } from '~/services/session.server';

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
  try {
    const user : any = await getUser(request);

    if (!user) {
      return json({ error: 'User not authenticated' }, { status: 401 });
    }

    const inquiries = await getAllInquiries(user._id );
    return json({ inquiries });
  } catch (error) {
    console.error('Failed to load inquiries:', error);
    return json({ error: 'Failed to load inquiries' }, { status: 500 });
  }
};
