interface UserType {
  id: number;
  email: string;
  activeStatus: string;
  role: string;
  createdAt: Date;
  departmentId: number;
  department: {
    id: number;
    name: string;
    createdAt: Date;
  };
  profile: {
    id: number;
    userId: number;
    firstName: string;
    lastName: string;
    middleName: string;
    gender: string;
    phone: string;
    imgUrl: string | null;
    addressId: number;
  };
}

interface ProductAttribute {
  id: number;
  productId: number;
  templateAttributeId: number;
  value: string;
}

interface ProductType {
  id: number;
  subcategoryId: number;
  name: string;
  createdAt: Date;
  productAttributes: ProductAttribute[];
}

export interface PurceasedRequestedItem_type {
  id: number;
  productId: number;
  purchasedRequestId: number;
  quantityToBePurchased: number;
  remark: string;
  unitPrice: number;
  products: ProductType;
}

export interface PurchasedRequest_type {
  id: number;
  materialRequestId: number; // Added based on initial data
  userId: number;
  createdAt: Date;
  isApproviedByGM: boolean;
  isApproviedByFinance: boolean;
  totalPrice: number;
  status: string; // Added based on initial data
  user: UserType;
  items: PurceasedRequestedItem_type[];
}
