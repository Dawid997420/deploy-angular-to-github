import { ProductDto } from "./ProductDto";

export interface OrderRequestDto {
  
  name: string ;
  surname: string;
  street: string;
  houseNumber: string;
  apartNumber: string;
  postalCode: string;
  city: string;
  phoneNumber: string;
  email: string;
  amount: string;
  productList: ProductDto[]
  deliveryMethod: string;
  accessPoint: string;
}