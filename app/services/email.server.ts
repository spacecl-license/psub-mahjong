import { json } from '@remix-run/node';
import nodemailer from 'nodemailer';
import { string } from 'yup';

import { VerificationModel } from '~/models';
import { validate } from '~/utils/utils.server';

import dbConnect from './db.server';
import { handleError, log } from './log.server';
import { getUser } from './session.server';

export const sendCode = async (request: Request) => {
  const formData = await request.formData();
  const email = formData.get('email');

  const validateError = await validate(string().email().required(), email);
  if (validateError) return validateError;

  try {
    const uuid = crypto.randomUUID();
    const randomCode = uuid.split('-')[0];

    const code = process.env.NODE_ENV === 'development'
      ? 'a12345'
      : randomCode;

    await dbConnect();
    await VerificationModel.create({ email, code });

    if (process.env.NODE_ENV !== 'development') {
      let transporter = nodemailer.createTransport({
        host: 'smtp.daum.net',
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_ADDRESS,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      // 메일 옵션 설정
      let mailOptions = {
        from: 'psub@psub.io',
        to: email as string,
        subject: 'PsuB NFT Gaming HUB 电子邮件验证码。',
        // text: `感谢您注册 PsuB Gaming HUB。 \n您的电子邮件验证码是 ${code}。 \n\n请输入验证码以完成注册。`,
        text: `您的电子邮件验证码是 ${code}。`,
      };

      // 이메일 전송
      await transporter.sendMail(mailOptions);

      log({
        request,
        code: 'send-email-code',
        message: 'email verification code sended.',
        formData,
      });

      return json({ email });
    }
    return json({ email });

  } catch (error) {
    handleError({ request, error });
  }
};

export const sendTransferInfo = async (request : Request) => {

  const user = await getUser(request);
  const email = user?.email;

  const validateError = await validate(string().email().required(), email);
  if (validateError) return validateError;

  try {
    const uuid = crypto.randomUUID();
    const randomCode = uuid.split('-')[0];

    const code = process.env.NODE_ENV === 'development'
      ? 'a12345'
      : randomCode;

    await dbConnect();
    await VerificationModel.create({ email, code });

    if (process.env.NODE_ENV !== 'development') {
      let transporter = nodemailer.createTransport({
        host: 'smtp.daum.net',
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_ADDRESS,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      // 메일 옵션 설정
      let mailOptions = {
        from: 'psub@psub.io',
        to: email as string,
        subject: 'PsuB NFT Gaming HUB 电子邮件验证码。',
        // text: `感谢您注册 PsuB Gaming HUB。 \n您的电子邮件验证码是 ${code}。 \n\n请输入验证码以完成注册。`,
        text: `您的电子邮件验证码是 ${code}。`,
      };

      // 이메일 전송
      await transporter.sendMail(mailOptions);

      log({
        request,
        code: 'send-email-code',
        message: 'email verification code sended.',
      });

      return json({ email });
    }
    return json({ email });

  } catch (error) {
    handleError({ request, error });
  }
};

export const sendClaimedNftInfo = async (email: string, txHash: string) => {
  try {
    await dbConnect();

    if (!email) {
      throw new Error('email is missing');
    }

    let transporter = nodemailer.createTransport({
      host: 'smtp.daum.net',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // 메일 옵션 설정
    let mailOptions = {
      from: 'psub@psub.io',
      to: email,
      subject: '导入 NFT',
      text: `Transaction ： https://bscscan.com/tx/${txHash}`,
    };

    // 이메일 전송
    await transporter.sendMail(mailOptions);

    return json({});

  } catch (error) {
    console.error(error);
  }
};
