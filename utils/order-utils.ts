import type { IOrder } from "~/stores/order-book/types";

export const useOrderUtils = () => ({
  mergeOrders(newValue: string[][], oldValue: Map<string, string>): Map<string, string> {

    newValue.forEach(([price = '0', quantity = '0']) => {
      const quantityInt = +quantity;

      if(quantityInt === 0 && oldValue.has(price)) {
        oldValue.delete(price);
      } else if(quantityInt > 0) {
        oldValue.set(price, quantity);
      }
    });

    return oldValue;
  },

  mapOrder([price, quantity]: string[]): IOrder {
    return {
      price,
      quantity,
      total: String(Number(price) * Number(quantity)),
    };
  }
});
