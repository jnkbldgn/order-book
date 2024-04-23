import type { IOrder } from "~/stores/order-book/types";

export interface ICTableOrdersProps {
  items: IOrder[];
  header: string;
  theme: 'ask' | 'bid';
}
