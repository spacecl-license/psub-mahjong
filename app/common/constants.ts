export enum THEME {
  DARK = 'dark',
  LIGHT = 'light',
}

export enum EMAIL_STATUS {
  WAITING = 'waiting',
  VERIFIED = 'verified',
  CANCELED = 'canceled',
  EXPIRED = 'expired',
}

export enum REFERER_STATUS {
  ENABLED = 'enabled',
  DISABLED = 'disabled',
}

export enum GAME_STATUS {
  PLAYING = 'playing',
  ENDED = 'ended',
  REWARDED = 'rewarded',
}

export enum REWARD_STATUS {
  OWNED = 'owned',
  SWAPPED = 'swapped',
  LOCKED = 'locked',
}

export enum SWAP_STATUS {
  OWNED = 'owned',
  SWAPPED = 'swapped',
  LOCKED = 'locked',
}

export enum RESERVED_TRANSFER_STATUS {
  RESERVED = 'reserved',
  TRANSFERRED = 'transferred',
}

export enum SORT {
  DESC = 'desc',
  ASC = 'asc',
}

export enum TOKEN {
  PSUB = 'PsuB',
  T_PSUB = 'tPsuB',
  USDT = 'USDT',
  BNB = 'BNB',
}

export enum LEDGER_STATUS {
  IDLE = 'idle',
  SUBMITTING = 'submitting',
  WAITING = 'waiting',
}

export enum TRANSFER_STATUS {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  REJECTED = 'rejected',
  ERROR = 'error',
}

export enum INVOICE_STATUS {
  PENDING = 'pending', // 대기 중
  INSUFFICIENT = 'insufficient', // 결제액 불 충분
  PAID = 'paid', // 지불 됨
  SUBMITTING = 'submitting', // 게임 생성 중
  GENERATED = 'generated', // 게임 생성 됨
  EXPIRED = 'expired', // 만료
  REJECTED = 'rejected', // 거절
  ERROR = 'error', // 에러
}

export enum INQUIRY_TYPE {
  INQUIRY = 'inquiry', // 문의
  COMPLETE = 'complete', // 완료
}

export enum VERIFICATION_TYPE {
  REGISTER = 'register', // 회원 등록
  TRANSFER = 'transfer', // 내부 전송
  WITHDRAW = 'withdraw', // 인출
}

export enum BOX_STATUS {
  IDLE = 'idle', // 사용 가능
  SUBMITTING = 'submitting', // 사용 중
  WAITING = 'waiting', // 결과 기다리는 중
}

export enum BOX_BETTING_TYPE {
  TWO_PLAYERS = '2p', // 2인
  THREE_PLATERS = '3p', // 3인
  FIVE_PLAYERS = '5p', // 5인
}

export enum BOX_BETTING_STATUS {
  SEARCHING = 'searching', // 매칭 검색 중
  WAITING = 'waiting', // 매칭되어 결과 대기
  ENDED = 'ended', // 결과 생성 및 완료
  CANCELED = 'canceled', // 취소 됨
  ERROR = 'error', // 에러
}

export enum LOTTERY_STATUS {
  UNOPENED = 'unopened', // 미개봉 복권
  OPENED = 'opened', // 개봉한 복권
}

export enum LOTTERY_TYPE {
  WINNER = 'winner', // 승리 지급 복권
  REFERRAL = 'referral', // 래퍼럴 지급 복권
}

// * 마스터 추천 코드
export const MASTER_CODE = '3fbe64d2' as const;

// * 필드 네임
export const BODY_FIELD = 'body' as const;

// * 토큰
export const PSUB = 'PsuB' as const;
export const T_PSUB = 'tPsuB' as const;
export const USDT = 'USDT' as const;
export const BNB = 'BNB' as const;

// * 블록체인 네트워크
export const ETHEREUM = 'ethereum' as const;
export const POLYGON = 'polygon' as const;
export const MUMBAI = 'mumbai' as const;
export const KLAYTN = 'klaytn' as const;
export const BAOBAB = 'baobab' as const;
export const BSC = 'bsc' as const;

export const KLAYTN_NETWORK = {
  chainId: '0x2019',
  chainName: 'Klaytn Mainnet',
  nativeCurrency: {
    name: 'KLAY',
    symbol: 'KLAY',
    decimals: 18,
  },
  rpcUrls: ['https://klaytn.blockpi.network/v1/rpc/public'],
  blockExplorerUrls: ['https://scope.klaytn.com'],
} as const;

export const KLAYTN_NETWORK_INPUT = {
  chainId: 8217,
  rpc: KLAYTN_NETWORK.rpcUrls,
  nativeCurrency: { ...KLAYTN_NETWORK.nativeCurrency },
  shortName: KLAYTN,
  slug: KLAYTN,
  testnet: false,
  chain: KLAYTN,
  name: KLAYTN_NETWORK.chainName,
} as const;

export const PSUB_CA = '0x19c0d5ddcf06f282e7a547d25ab09fe5a7984aae' as const;

export const JAN = 'jan' as const;
export const FEB = 'feb' as const;
export const MAR = 'mar' as const;
export const APR = 'apr' as const;
export const MAY = 'may' as const;
export const JUN = 'jun' as const;
export const JUL = 'jul' as const;
export const AUG = 'aug' as const;
export const SEP = 'sep' as const;
export const OCT = 'oct' as const;
export const NOV = 'nov' as const;
export const DEC = 'dec' as const;

export const LEVEL_TO_MONTH_MAP = {
  1: JAN,
  2: FEB,
  3: MAR,
  4: APR,
  5: MAY,
  6: JUN,
  7: JUL,
  8: AUG,
  9: SEP,
  10: OCT,
  11: NOV,
  12: DEC,
} as const;

export const MONTH_TO_LEVEL_MAP = {
  [JAN]: 1,
  [FEB]: 2,
  [MAR]: 3,
  [APR]: 4,
  [MAY]: 5,
  [JUN]: 6,
  [JUL]: 7,
  [AUG]: 8,
  [SEP]: 9,
  [OCT]: 10,
  [NOV]: 11,
  [DEC]: 12,
} as const;
