import type {
  BAOBAB, BSC, ETHEREUM, KLAYTN, LEVEL_TO_MONTH_MAP, MONTH_TO_LEVEL_MAP, TOKEN,
} from './constants';

export {};

declare global {
  type LogType = 'info' | 'error';

  type RewardBonusRate = 0 | 0.2 | 0.3 | 0.5 | 1 | 2 | 10;

  type LotteryBonusRate = 0 | 0.03 | 0.05 | 0.1 | 0.15

  type RewardRank = 1 | 2 | 3 | 4 | 5;

  interface ErrorData {
    path?: string | string[];
    error: string | unknown;
  }

  type Nft = {
    month: number;
    level: number;
    imageUrl: string;
    name: string;
    price: {
      [key in TOKEN]: number;
    }
  }

  type ChainNetworkId = typeof ETHEREUM | typeof KLAYTN | typeof BAOBAB | typeof BSC;

  type Month = keyof typeof MONTH_TO_LEVEL_MAP;
  type MonthLevel = keyof typeof LEVEL_TO_MONTH_MAP;
}
