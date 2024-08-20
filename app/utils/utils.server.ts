import { json } from '@remix-run/node';
import { ValidationError } from 'yup';

import { BODY_FIELD } from '~/common/constants';

// * yup 유효성 검증 유틸
export const validate = async (scheme: any, payload: any) => {
  try {
    await scheme.validate(payload);
    return null;
  } catch (error) {
    console.error(error);

    if (error instanceof ValidationError) {
      return json<ErrorData>({
        path: (error as ValidationError).path,
        error: (error as ValidationError).errors[0],
      }, 400);
    } else {
      return json<ErrorData>({
        error,
      }, 500);
    }
  }
};

// * 허용되지 않은 메소드 405 리턴
export const handleNotAllowedMethod = () => {
  return json<ErrorData>({ error: 'method not allowed.' }, 405);
};

// * fetch response handler
export const handleResponse = async <T>(response: Response): Promise<T> => {
  if (response.ok) {
    return await response.json();
  } else {
    console.error(response);
    throw Error(`HTTP-Error: ${response.status}`);
  }
};

// * FormData에서 body 필드 파싱(JSON 양식처럼 FormData 사용할 때)
export const parseFormBodyData = (formData: FormData) => {
  return JSON.parse(formData.get(BODY_FIELD) as string);
};

// * URL에서 searchParams 파싱
export const parseSearchParams = (url: string) => {
  const urlObj = new URL(url).searchParams;
  return Object.fromEntries(urlObj);
};

// * IP 주소 확인
export const getIpAddress = (request: Request) => {
  const headers = Object.fromEntries(request.headers);
  return headers['x-real-ip'] || headers['x-forwarded-for'] || '0.0.0.0';
};
