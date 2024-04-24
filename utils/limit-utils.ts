import type { ILimit } from "~/stores/order-book/types";

export const useLimitUtils = () => ({
  mapLimit(value: number, currentValue: number): ILimit {
    return {
      value,
      current: value === currentValue
    };
  }
});
