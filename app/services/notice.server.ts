import { json } from '@remix-run/node';
import type { ObjectId } from 'mongoose';

import { NoticeModel } from '~/models';
import type Notice from '~/models/notice';

import dbConnect from './db.server';
import { handleError, log } from './log.server';
import { getUser } from './session.server';

export interface GetNoticesArguments {
  page?: number;
}

const PER_PAGE = 10;

// * 공지사항 목록 조회
export const getNotices =  async ({ page = 1 }) => {
  await dbConnect();

  const notices = await NoticeModel.find<Notice>({})
    .sort({ createdAt: -1 })
    .skip((page - 1) * PER_PAGE)
    .limit(PER_PAGE);

  return notices;
};

// * 공지사항 아이디로 조회
export const getNoticeById = async (noticeId: ObjectId) => {
  await dbConnect();

  const notice = await NoticeModel.findById<Notice>(noticeId);

  return notice;
};

// * 공지사항 등록
export const createNotice = async (request: Request) => {
  const formData = await request.formData();
  const payload = Object.fromEntries(formData);

  if (!payload.title) {
    return json<ErrorData>({
      error: 'title must required.',
    }, { status: 400 });
  }

  if (!payload.content) {
    return json<ErrorData>({
      error: 'content must required.',
    }, { status: 400 });
  }

  try {
    await dbConnect();
    const user = await getUser(request);

    if (!user) {
      return json<ErrorData>({
        error: 'user not found.',
      }, { status: 401 });
    }

    const newNotice = await NoticeModel.create({
      title: payload.title,
      content: payload.content,
      creator: user._id,
    });

    log({
      request,
      code: 'create-notice',
      message: 'notice created.',
      formData,
    });

    return json({
      newNotice,
    });

  } catch (error) {
    handleError({ request, error });
  }
};

// * 공지사항 수정
export const updateNotice = async (request: Request) => {
  const formData = await request.formData();
  const payload = Object.fromEntries(formData);

  if (!payload.title) {
    return json<ErrorData>({
      error: 'title must required.',
    }, { status: 400 });
  }

  if (!payload.content) {
    return json<ErrorData>({
      error: 'content must required.',
    }, { status: 400 });
  }

  try {
    await dbConnect();
    const user = await getUser(request);

    if (!user) {
      return json<ErrorData>({
        error: 'user not found.',
      }, { status: 401 });
    }

    const updatedNotice = await NoticeModel.findByIdAndUpdate(payload._id.toString(), {
      title: payload.title.toString(),
      content: payload.content.toString(),
      updator: user._id,
      updatedAt: new Date(),
    });

    if (!updatedNotice) {
      return json<ErrorData>({
        error: 'notice not found.',
      }, { status: 404 });
    }

    log({
      request,
      code: 'update-notice',
      message: 'notice updated.',
      formData,
    });

    return json({
      updatedNotice,
    });

  } catch (error) {
    handleError({ request, error });
  }
};

// * 공지사항 삭제
export const deleteNotice = async (request: Request) => {
  const formData = await request.formData();
  const payload = Object.fromEntries(formData);

  try {
    await dbConnect();
    const user = await getUser(request);

    if (!user) {
      return json<ErrorData>({
        error: 'user not found.',
      }, { status: 401 });
    }

    const deletedNotice = await NoticeModel.findByIdAndDelete(payload._id.toString());

    if (!deletedNotice) {
      return json<ErrorData>({
        error: 'notice not found.',
      }, { status: 404 });
    }

    log({
      request,
      code: 'delete-notice',
      message: 'notice deleted.',
      formData,
    });

    return json({
      status: 'ok',
    });

  } catch (error) {
    handleError({ request, error });
  }
};
