export type UnitPriceMinor = number;

export interface LineItemType {
  id: string;
  quoteId: string;
  name: string;
  description: string;
  unitPrice: UnitPriceMinor;
  quantity: number;
  photoUrl?: string;
}
