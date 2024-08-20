import { json } from '@remix-run/node';
import mongoose from 'mongoose';

import { InquiryModel  } from '~/models';
import type User from '~/models/user';

import  dbConnect  from './db.server';

export const createInquiry = async (user : User, title : string, detail : string, imageFiles : any) => {

  if (!title) {
    throw new Error('Title is required.');
  }

  if (!detail) {
    throw new Error('Content is required.');
  }

  try {
    await dbConnect();

    if (!user) {
      throw new Error('User not found.');
    }

    const image = imageFiles ? imageFiles : '';

    const inquiry =  await InquiryModel.create({
      user,
      title,
      content: detail,
      image,
      createdAt: new Date(),
    });

    return json({ inquiry });
  } catch (error) {
    return json({ error: 'An error occurred while creating the inquiry.' }, { status: 500 });
  }
};

export const getAllInquiries = async (userId : string) => {
  await dbConnect();

  const inquiries = await InquiryModel
    .find({ user : userId })
    .sort({ createdAt: -1 });

  return inquiries;
};

// 특정 Inquiry 아이디로 검색하는 함수
export async function getUserAskInquiryById(id: string) {
  await dbConnect();
  const userAskInquiry = await InquiryModel.findById(new mongoose.Types.ObjectId(id));
  return userAskInquiry;
}
