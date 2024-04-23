import type {IGetters} from '~/stores/types';

export interface IPair {
  current: boolean;
  value: string;
}

export interface ILog {
  date: string,
  from: string,
  to: string,
}

export interface ISettingsState {
  pairs: IPair[];
  logs: ILog[];
}

export interface ISettingsGetters extends IGetters {
  currentPair(state: ISettingsState): IPair;
}

export interface ISettingsActions {
  fetchPairs(): Promise<void>;
  changeCurrentPair(item: IPair): void;
}

export type TSettingsStoreId = 'settings-store';
