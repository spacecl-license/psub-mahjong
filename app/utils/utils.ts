import { MASTER_CODE } from '~/common/constants';
import { NFTS } from '~/common/nfts';
import type Game from '~/models/game';
import type GameV2 from '~/models/game-v2';
import type UserReferral from '~/models/user-referral';

// * 숫자 랜덤 코드 생성
export const generateRandomNumberCode = (n: number) => {
  let str = '';

  for (let i = 0; i < n; i++) {
    str += Math.floor(Math.random() * 10);
  }
  return str;
};

// * 세자리 콤마
export const toComma = (
  value: number | string,
  maxDecimals: number | undefined = 4,
) => {
  if (typeof value === 'string') {
    value = parseFloat(value);
  }
  return value.toLocaleString(undefined, { maximumFractionDigits: maxDecimals });
};

// * 상위 추천인이 마스터인지 확인
export const aboveReferralIsMaster = (userReferral: UserReferral) =>
  (userReferral!.referral as UserReferral).referralCode === MASTER_CODE;

// * 완료한 게임인지 여부
export const isEndedGame = (game: Game) => {
  let isEnded = false;
  if (
    game.left &&
    (game.left as Game)?.left &&
    (game.left as Game)?.right &&
    game.right &&
    (game.right as Game)?.left &&
    (game.right as Game)?.right
  ) isEnded = true;
  return isEnded;
};

// * 완료한 게임인지 여부 (V2)
export const isEndedGameV2 = (game: GameV2) => {
  let isEnded = false;
  if (game.children.length === 6) isEnded = true;
  return isEnded;
};

// * nft 가져오기
export const getNft = (level: number | string) => {
  const nft = NFTS[`${level}月`];
  return nft ? nft : null;
};
