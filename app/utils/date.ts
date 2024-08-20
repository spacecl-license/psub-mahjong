import 'dayjs/locale/ko';

import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';

dayjs.locale('ko');
dayjs.extend(localizedFormat);

// * 날짜 locale format
export const localizedFormatDate = (date: Date | string | dayjs.Dayjs, format: string = 'LL') => {
  return dayjs(date).format(format);
};

// * 날짜 format
export const formatDate = (date: Date | string | dayjs.Dayjs, format: string = 'YYYY.MM.DD') => {
  switch (format) {
    case 'YY.MM.DD':
      return dayjs(date).format(format);
    case 'ko':
      dayjs.locale('ko');
      return dayjs(date).format('YYYY년 M월 DD일');
    default:
      return dayjs(date).format(format);
  }
};

// * 과거 시간 계산
export const fromNow = (date: Date | string | dayjs.Dayjs, language: string = 'ko') => {
  const currentDate = dayjs();
  const diffInSeconds = currentDate.diff(date, 'second');
  const diffInMinutes = currentDate.diff(date, 'minute');
  const diffInHours = currentDate.diff(date, 'hour');
  const diffInDays = currentDate.diff(date, 'day');
  const diffInWeeks = currentDate.diff(date, 'week');
  const diffInMonths = currentDate.diff(date, 'month');
  const diffInYears = currentDate.diff(date, 'year');

  switch (true) {
    case diffInSeconds < 60:
      return language === 'ko' ? '방금 전' : 'just now';
    case diffInMinutes < 60:
      return language === 'ko' ? `${diffInMinutes}분 전` : `${diffInMinutes} minutes ago`;
    case diffInHours < 24:
      return language === 'ko' ? `${diffInHours}시간 전` : `${diffInHours} hours ago`;
    case diffInDays < 7:
      return language === 'ko' ? `${diffInDays}일 전` : `${diffInDays} days ago`;
    case diffInWeeks < 4:
      return language === 'ko' ? `${diffInWeeks}주 전` : `${diffInWeeks} weeks ago`;
    case diffInMonths < 12:
      return language === 'ko' ? `${diffInMonths}개월 전` : `${diffInMonths} months ago`;
    default:
      return language === 'ko' ? `${diffInYears}년 전` : `${diffInYears} years ago`;
  }
};
