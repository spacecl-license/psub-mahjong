import type { ActionFunction, MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';

import { createInquiry } from '~/services/inquiry.server';
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

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const user = await getUser(request);

  const title = formData.get('title') as string;
  const detail = formData.get('detail') as string;
  const imageFiles = formData.get('imageFiles')as string;

  if (!user) {
    return json({ error: 'User not found.' }, { status: 401 });
  }

  if (!title) {
    return json({ error: 'Title is required.' }, { status: 400 });
  }

  if (!detail) {
    return json({ error: 'Content is required.' }, { status: 400 });
  }

  try {
    if (request.method === 'POST') {
      await createInquiry(user!, title, detail, imageFiles);
      return json({ success: true });
    }
  } catch (error : any) {
    console.error(error);
    return json({ error: error.message }, { status: error.status });
  }
};
