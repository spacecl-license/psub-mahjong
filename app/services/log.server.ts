import { json } from '@remix-run/node';

import { LogModel } from '~/models';
import { getIpAddress } from '~/utils/utils.server';

import dbConnect from './db.server';
import { getUser } from './session.server';

// * 로그 데이터 생성
interface LogArguments {
  request: Request;
  code: string;
  message?: string;
  formData?: FormData | null;
  type?: LogType;
}

export const log = async ({
  request,
  code,
  message,
  formData,
  type = 'info',
}: LogArguments) => {
  await dbConnect();
  const url = new URL(request.url);

  if (!formData) {
    try {
      formData = await request.formData();
    } catch (error) {
      formData = null;
    }
  }
  const user = await getUser(request);

  await LogModel.create({
    type,
    code,
    ip: getIpAddress(request),
    url: url.href,
    pathName: url.pathname,
    method: request.method,
    headers: Object.fromEntries(request.headers),
    searchParams: Object.fromEntries(url.searchParams),
    body: null, // * Vercel body 데이터 인젝션으로 인해 null 처리. formData만 사용할 것
    formData: formData ? Object.fromEntries(formData!) : null,
    user,
    message,
  });
};

// * 에러 데이터 생성
interface HandleErrorArguments {
  request: Request;
  error: unknown;
  code?: string | number;
  responseJson?: boolean;
}

export const handleError = async ({
  request,
  error,
  code,
  responseJson = true,
}: HandleErrorArguments) => {
  console.error(error);
  let message = 'Unknown Error';
  if (error instanceof Error) message = error.message;

  log({
    request,
    code: code ? `${code}` : 'unknown',
    message,
    type: 'error',
  });

  return responseJson
    ? json<ErrorData>({ error }, { status: 500 })
    : null;
};
