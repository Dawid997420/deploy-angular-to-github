import { Injectable } from '@angular/core';
import { Product } from '../model/Product';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class PopupService {
  


  
  product:Product={
    id: 0,
    name: '',
    description: {
      id:0,
      sections:[]
    },
    ean: '',
    sku: '',
    externalReferences: [],
    externalAttributes: [],
    externalCategories: [],
    images: [],
    price: 0,
    purchasedCount: 0,
    cataloguePrice: 0,
    referencePriceType: '',
    stock: 0,
    status: '',
    deliveryPriceList: '',
    weight: 0,
    invoiceType: '',
    checked:true
  }


   private visiblePopupSubject = new BehaviorSubject<boolean>(false);
  visiblePopup$ = this.visiblePopupSubject.asObservable();

  showPopup() {


    this.visiblePopupSubject.next(true);
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
   // setTimeout(() => this.hidePopup(), 2000); // np. 2 sekundy
  }

  hidePopup() {
    this.visiblePopupSubject.next(false);
  }



}
