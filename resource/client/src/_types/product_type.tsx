import { ProductCategoryType } from "./productCategory_type";
import { ProductSubCategoryType } from "./productSubcategory_type";
import { ProductAttributeType } from "./template_type";

export interface ProductType {
  id: number;
  subcategoryId: number;
  name: string;
  createdAt: Date;
  category: ProductCategoryType;
  subcategory: ProductSubCategoryType;
  productAttributes: ProductAttributeType[];
}
