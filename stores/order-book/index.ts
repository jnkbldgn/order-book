import { defineStore } from "pinia";
import type { ILimit, IOrderBookActions, IOrderBookGetters, IOrderBookState, TOrderBookStoreId } from "./types";
import { useOrderBookApi } from "~/api/order-book";
import { useOrderBookWS } from "~/websocket/order-book";
import { useSettingsStore } from "../settings";

function getClearSymbol(symbol: string): string {
  return symbol.replace('-', '');
}

const DEFAULT_LIMIT: ILimit = {
  value: 100,
  current: true,

};

const orderUtils = useOrderUtils();
const limitUtils = useLimitUtils();


export const useOrderBookStore = defineStore<TOrderBookStoreId, IOrderBookState, IOrderBookGetters, IOrderBookActions>({
  id: 'order-book-store',

  state: () => ({
    limits: [],
    lastUpdateId: 0,
    asks: new Map<string, string>(),
    bids: new Map<string, string>(),
    isWSOpen: false,
  }),

  getters: {
    currentLimit(state) {
      return state.limits.find(it => it.current) ?? DEFAULT_LIMIT;
    },

    asksSorted(state) {
      return Array.from(state.asks.entries())
        .map(orderUtils.mapOrder)
        .toSorted((a, b) => +a.price - +b.price)
        .slice(0, this.currentLimit.value);
    },

    bidsSorted(state) {
      return Array.from(state.bids.entries())
        .map(orderUtils.mapOrder)
        .toSorted((a, b) => +b.price - +a.price)
        .slice(0, this.currentLimit.value);
    },
  },

  actions: {
    async fetchLimits() {
      const apiOrderBook = useOrderBookApi();

      const response = await apiOrderBook.fetchLimits();

      this.limits = response.map((it) => limitUtils.mapLimit(it, DEFAULT_LIMIT.value));
    },

    changeCurrentLimit(item) {
      if(item.value === this.currentLimit.value) {
        return;
      }

      this.limits = this.limits.map((it) => limitUtils.mapLimit(it.value, item.value));
    },

    async fetchDepth(symbol: string, limit: number) {
      const clearSymbol = getClearSymbol(symbol);
      const apiOrderBook = useOrderBookApi();
      const { currentPair } = useSettingsStore();

      if(getClearSymbol(currentPair.value) !== clearSymbol){
        return;
      }

      const {lastUpdateId, asks = [], bids = []} = await apiOrderBook.fetchDepth(clearSymbol, limit);

      this.asks = orderUtils.mergeOrders(asks, new Map());
      this.bids = orderUtils.mergeOrders(bids, new Map());
      this.lastUpdateId = lastUpdateId;
    },

    openStream(symbol: string) {
      const clearSymbol = getClearSymbol(symbol).toLowerCase();
      const wsOrderBook = useOrderBookWS();

      const onMessage = (event: MessageEvent) => {
        const { id = -1, data = {} } = JSON.parse(event.data);

        if(id === wsOrderBook.idStart) {
          this.isWSOpen = true;
          return;
        }

        if(!this.isWSOpen || id === wsOrderBook.closeStream || data.u <= this.lastUpdateId) {
          return;
        }

        if(this.lastUpdateId + 1 >= data.U && data.u >= this.lastUpdateId + 1) {
          this.lastUpdateId = data.u;

          orderUtils.mergeOrders(data.a ?? [], this.asks);
          orderUtils.mergeOrders(data.b ?? [], this.bids);
        } else {
          this.fetchDepth(data.s, this.currentLimit.value);
        }
      };

      wsOrderBook.createStream(
        clearSymbol,
        onMessage,
      );
    },

    closeStream(symbol: string) {
      const wsOrderBook = useOrderBookWS();
      const clearSymbol = getClearSymbol(symbol).toLowerCase();

      wsOrderBook.closeStream(clearSymbol);

      this.isWSOpen = false;

      this.lastUpdateId = 0;
      this.asks.clear();
      this.bids.clear();
    },
  }
});
