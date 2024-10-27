import { ProductType } from "./product_type";
import { StoreType } from "./store_type";
import { UserType } from "./user_type";

export enum StoreInventoryActionType {
  IN = "IN",
  OUT = "OUT",
}

export interface StoreInventoryType {
  id: number;
  storId: number;
  store: StoreType;
  userId: UserType;
  productId: number;
  product: ProductType;
  quantity: number;
  currentQuantity: number;
  type: StoreInventoryActionType;
  createdAt: Date;
}

export interface StoreInventoryStoke {
  storeId: number;
  productId: number;
  productName: string;
  storeName: string;
  currentQuantity: number;
}
