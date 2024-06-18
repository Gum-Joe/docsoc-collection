export function docsocTypes(): string {
  return 'docsoc-types';
}

export interface OrderResponse {
  orderIDInternal: number;
  orderNoShop: number;
  date: Date;

  items: {
    id: number;
    name: string;
    variant: string;
    collected: boolean;
  }[]
}
