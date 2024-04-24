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
  asks: Map<string, string>;
  bids: Map<string, string>;
  isWSOpen: boolean;
}

export interface IOrderBookGetters extends IGetters {
  currentLimit(state: IOrderBookState): ILimit;
  asksSorted(state: IOrderBookState): IOrder[];
  bidsSorted(state: IOrderBookState): IOrder[];

}

export interface IOrderBookActions {
  fetchLimits(): Promise<void>;
  changeCurrentLimit(item: ILimit): void;
  fetchDepth(symbol: string, limit: number): Promise<void>;
  openStream(symbol: string): void;
  closeStream(symbol: string): void;
}

export type TOrderBookStoreId = 'order-book-store';
