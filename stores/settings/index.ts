import { defineStore } from "pinia";
import { usePairsApi } from "~/api/pairs";
import type { IPair, ISettingsActions, ISettingsGetters, ISettingsState, TSettingsStoreId } from "./types";

const DEFAULT_PAIR: IPair = {
  value: 'BTC-USDT',
  current: true,
} ;

export const useSettingsStore = defineStore<TSettingsStoreId, ISettingsState, ISettingsGetters, ISettingsActions>({
  id: 'settings-store',

  state: () => ({
    pairs: [],
    logs: [],
  }),

  getters: {
    currentPair(state) {
      return state.pairs.find(it => it.current) ?? DEFAULT_PAIR;
    }
  },

  actions: {
    async fetchPairs() {
      const apiPair = usePairsApi();

      const response = await apiPair.fetchPairs();

      this.$state.pairs = response.map((it) => ({
        value: it,
        current: it === DEFAULT_PAIR.value,
      }));
    },

    changeCurrentPair(item) {
      if(item.value === this.currentPair.value) {
        return;
      }

      this.$state.logs.unshift({
        date: new Date().toLocaleString(),
        from: this.currentPair.value,
        to: item.value,
      });

      this.$state.pairs = this.$state.pairs.map((it) => ({
        value: it.value,
        current: it.value === item.value,
      }));

    },
  }
});
