import { Description } from "./Description"
import { DispatchTime } from "./DispatchTime";

import { ExternalAttribute } from "./ExternalAttribute";

import { ExternalCategory } from "./ExternalCategory";

import { ExternalReference } from "./ExternalReference";
import { Image } from "./Image";

export class Product {
  id?: number;
  name!: string;
  description!: Description;
  ean!: string;
  sku!: string;
  externalReferences!: ExternalReference[];
  externalAttributes!: ExternalAttribute[];
  externalCategories!: ExternalCategory[];
  images!: Image[];
  price!: number;


  promotionStartDate?: string;
  promotionEndDate?: string;

  purchasedCount!: number;
  cataloguePrice!: number;
  referencePriceType!: string;
  stock!: number;
  status!: string;
  dispatchTime?: DispatchTime;
  deliveryPriceList!: string;

  promotion?: boolean;
  promotionalPrice?: number;

  weight!: number;
  invoiceType!: string;
  
  checked: boolean = true; // ✅ domyślna wartość

  constructor(init?: Partial<Product>) {
    Object.assign(this, init);
  }
}