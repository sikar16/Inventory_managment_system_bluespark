import { ProductType } from "./product_type";
import { PurchasedOrderType } from "./purchasedOrder_type";
import { SupplierType } from "./supplier_type";

export interface SupplierOfferItem {
  productId: ProductType;
  quantity: number;
  unitPrice: number;
}

// Main interface for Supplier Offer
export interface SupplierOffer {
  id: number;
  purchasedOrderId: number;
  purchasedOrder: PurchasedOrderType;
  supplayerId: number;
  supplayer: SupplierType;
  totalPrice: number;
  items: SupplierOfferItem[];

  createdAt: String;
}

export interface SupplierOfferRequest {
  purchasedOrderId: number;
  supplayerId: number;
  totalPrice: number;
  items: OfferItem[];
}
export interface OfferItem {
  productId: number;
  quantity: number;
  unitPrice: number;
}
