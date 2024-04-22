import { defineStore } from "pinia";
import { usePairsApi } from "~/api/pairs";

const CURRENT_VALUE: string = 'BTC-USDT';

interface IPair {
  current: boolean,
  value: string,
}

interface ILog {
  date: string,
  from: string,
  to: string,
}

interface ISettingsState {
  pairs: IPair[];
  logs: ILog[];
}

interface ISettingsGetters {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
  currentPair(state: ISettingsState): IPair;
}

interface ISettingsActions {
  fetchPairs(): Promise<void>;
  changeCurrentPair(item: IPair): void;
}

type TSettingsStoreId = 'settings-store';

export const useSettingsStore = defineStore<TSettingsStoreId, ISettingsState, ISettingsGetters, ISettingsActions>({
  id: 'settings-store',

  state: () => ({
    pairs: [],
    logs: [],
  }),

  getters: {
    currentPair(state) {
      let current = state.pairs.find(it => it.current);

      if(!current) {
        current = state.pairs[0];
        current.current = true;
      }

      return current;
    }
  },

  actions: {
    async fetchPairs() {
      const apiPair = usePairsApi();

      try {
        const response = await apiPair.fetchPairs();

        this.$state.pairs = response.map((it) => ({
          value: it,
          current: it === CURRENT_VALUE,
        }));

      } catch (error) {
        console.error(error);
      }
    },

    changeCurrentPair(item: IPair) {
      if(item.value === this.currentPair.value) {
        return;
      }

      this.$state.logs.push({
        date: new Date().toLocaleString(),
        from: this.currentPair.value,
        to: item.value,
      });

      this.$state.pairs = this.$state.pairs.map((it) => ({
        value: it.value,
        current: it.value === item.value,
      }));

    }
  }
});
