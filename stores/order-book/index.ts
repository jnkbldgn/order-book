import { defineStore } from "pinia";
import type { ILimit, IOrder, IOrderBookActions, IOrderBookGetters, IOrderBookState, TOrderBookStoreId } from "./types";
import { useOrderBookApi } from "~/api/order-book";
import { useOrderBookWS } from "~/websocket/order-book";

function getClearSymbol(symbol: string): string {
  return symbol.replace('-', '');
}

function mergeOrders(newValue: IOrder[], oldValue: IOrder[], limit: number): IOrder[] {
  let result: IOrder[] = newValue.slice(0, limit);

  if(result.length < limit - 1) {
    result = result.concat(oldValue.slice(result.length, limit));
  }

  return result;
}

function mapOrder([price, quantity]: string[]): IOrder {
  return {
    price,
    quantity,
    total: String(Number(price) * Number(quantity)),
  };
}

function mapLimit(value: number, currentValue: number): ILimit {
  return {
    value,
    current: value === currentValue
  };
}

const DEFAULT_LIMIT: ILimit = {
  value: 100,
  current: true,

};


export const useOrderBookStore = defineStore<TOrderBookStoreId, IOrderBookState, IOrderBookGetters, IOrderBookActions>({
  id: 'order-book-store',

  state: () => ({
    limits: [],
    lastUpdateId: 0,
    asks: [],
    bids: [],
  }),

  getters: {
    currentLimit(state) {
      return state.limits.find(it => it.current) ?? DEFAULT_LIMIT;
    },

    maxLimit(state) {
      return Math.max(...state.limits.map((it) => it.value), DEFAULT_LIMIT.value);
    }
  },

  actions: {
    async fetchLimits() {
      const apiOrderBook = useOrderBookApi();

      const response = await apiOrderBook.fetchLimits();

      this.$state.limits = response.map((it) => mapLimit(it, DEFAULT_LIMIT.value));
    },

    changeCurrentLimit(item) {
      if(item.value === this.currentLimit.value) {
        return;
      }

      this.$state.limits = this.$state.limits.map((it) => mapLimit(it.value, item.value));
    },

   async fetchDepth(symbol: string) {
    const clearSymbol = getClearSymbol(symbol);
    const apiOrderBook = useOrderBookApi();

    const {lastUpdateId, asks, bids} = await apiOrderBook.fetchDepth(clearSymbol, this.maxLimit);

    this.updateDepth(lastUpdateId, asks, bids);
   },

  updateDepth(id: number, asks: string[][], bids: string[][]) {
    this.$state.lastUpdateId = id;

    const newAsks = asks.map((it) => mapOrder(it));
    const newBids = bids.map((it) => mapOrder(it));

    this.$state.asks = mergeOrders(newAsks, this.$state.asks, this.maxLimit);
    this.$state.bids = mergeOrders(newBids, this.$state.bids, this.maxLimit);
  },

   openStream(symbol: string) {
    const clearSymbol = getClearSymbol(symbol).toLowerCase();
    const wsOrderBook = useOrderBookWS();

    wsOrderBook.createStream(
      clearSymbol,
      this.$state.lastUpdateId + 1,
      (id, asks, bids) => this.updateDepth(id, asks, bids)
    );
   },

   closeStream(symbol: string) {
    const wsOrderBook = useOrderBookWS();
    const clearSymbol = getClearSymbol(symbol).toLowerCase();

    wsOrderBook.closeStream(clearSymbol);

    this.$state.lastUpdateId = 0;
    this.$state.asks = [];
    this.$state.bids = [];
   },
  }
});
