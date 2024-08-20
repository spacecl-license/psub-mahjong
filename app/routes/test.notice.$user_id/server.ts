import {
  type ActionFunction,
  json,
  type LoaderFunction,
  type MetaFunction,
  redirect,
} from '@remix-run/node';

import { NoticeModel, UserModel } from '~/models';
import type Notice from '~/models/notice';
import dbConnect from '~/services/db.server';
import { createNotice, deleteNotice, updateNotice } from '~/services/notice.server';
import { getUser } from '~/services/session.server';
import { handleNotAllowedMethod } from '~/utils/utils.server';

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
  // 로그인 세션 정보 가져오기
  const user = await getUser(request);

  if (!user || !user.isAdmin) {
    return redirect('/');
  }

  await dbConnect();

  // url 변조로 인한 접근 제어처리
  const { user_id } = params;
  const dbUser = await UserModel.findById(user_id);

  if (!dbUser || !dbUser.isAdmin) {
    return redirect('/');
  }

  // 공지사항 목록 데이터 가져오기
  const notices = await NoticeModel.find<Notice>({}).sort({ createdAt: -1 });

  return json({
    notices,
  });
};

export const action: ActionFunction = async ({ request }) => {
  switch (request.method) {
    // * POST: 공지사항 작성
    case 'POST': {
      return createNotice(request);
    }

    // * PUT: 공지사항 수정
    case 'PUT': {
      return updateNotice(request);
    }

    // * DELETE: 공지사항 삭제
    case 'DELETE': {
      return deleteNotice(request);
    }

    default: {
      return handleNotAllowedMethod();
    }
  }
};
