import { BreadCrump } from "./BreadCrump";

export interface ExternalCategory {

  idd?: number;
  source: string;
  breadcrumb: BreadCrump[];
  
}