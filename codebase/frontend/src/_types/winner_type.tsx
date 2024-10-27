export interface WinnerType {
  id: number;
  createdAt: string;
  supplayerId: number;
  purchasedOrderId: number;
  userId: number;
  supplayer: {
    id: number;
    categoryId: number;
    fullName: string;
    phone: string;
    email: string;
    addressId: number;
    createdAt: string;
  };
}
