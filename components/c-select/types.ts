type TValue = string | number;

export interface ISelectItem {
  current: boolean;
  value: TValue;
}

export interface ICSelectProps {
  items: ISelectItem[];
  value: TValue;
  hint: string;
}

export interface ICSelectEmits {
  (e: 'change', item: ISelectItem): void;
}
