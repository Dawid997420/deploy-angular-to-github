import { Product } from "../model/Product";

export interface ProductPageResponse {
  products: Product[] ;
  totalPages: number;
  totalElements: number;
  currentPage: number;

}