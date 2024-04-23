import type {IGetters} from '~/stores/types';

export interface ILimit {
  current: boolean;
  value: number;
}

export interface IOrder {
  price: string;
  quantity: string;
  total: string;
}

export interface IOrderBookState {
  limits: ILimit[];
  lastUpdateId: number,
  asks: IOrder[];
  bids: IOrder[];
}

export interface IOrderBookGetters extends IGetters {
  currentLimit(state: IOrderBookState): ILimit;
  maxLimit(state: IOrderBookState): number;
}

export interface IOrderBookActions {
  fetchLimits(): Promise<void>;
  changeCurrentLimit(item: ILimit): void;
  fetchDepth(symbol: string): Promise<void>;
  updateDepth(id: number, asks: string[][], bids: string[][]): void;
  openStream(symbol: string): void;
  closeStream(symbol: string): void;
}

export type TOrderBookStoreId = 'order-book-store';
