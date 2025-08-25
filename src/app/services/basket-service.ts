import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Product } from '../model/Product';
import { PopupService } from './popup-service';

@Injectable({
  providedIn: 'root'
})
export class BasketService {
  public basket: Product[] = [];
  public weAreInTheBasket: boolean = false;
  productsInTheBasket: number = 0;

  constructor(
    public popupService: PopupService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {

        this.loadFromLocalStorage();

  }

  /** Zapis koszyka do localStorage (tylko w przeglądarce) */
  updateBasketStorage() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('basket', JSON.stringify(this.basket));
    }
  }

  addProductsToBasket(product: Product, quantity: number) {
    for (let i = 0; i < quantity; i++) {
      this.basket.push(product);
    }
  }

  removeProductsFromBasket(product: Product, quantity: number) {
    let removed = 0;
    for (let i = this.basket.length - 1; i >= 0 && removed < quantity; i--) {
      if (this.basket[i].id === product.id) {
        this.basket.splice(i, 1);
        removed++;
      }
    }
  }

  addProductToBasket(product: Product) {
    this.basket.push(product);
    this.saveToLocalStorage();
    this.productsInTheBasket = this.productsInTheBasket + 1;
  }

  removeOneProductFromBasket(): void {
    this.productsInTheBasket = this.productsInTheBasket - 1;
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem("basket-number", JSON.stringify(this.productsInTheBasket));
    }
  }

  private saveToLocalStorage(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('basket', JSON.stringify(this.basket));
      localStorage.setItem("basket-number", JSON.stringify(this.productsInTheBasket));
    }
  }

  /** To wywołaj w komponencie np. ngOnInit */
  loadFromLocalStorage(): void {
    if (isPlatformBrowser(this.platformId)) {
      const data = localStorage.getItem('basket');
      const basketNumber = localStorage.getItem("basket-number");

      if (data) {
        this.basket = JSON.parse(data);
      }
      if (basketNumber) {
        this.productsInTheBasket = JSON.parse(basketNumber) + 1;
      }
    }
  }

  getGroupedBasket() {
    const grouped: { [key: string]: any } = {};
    for (const product of this.basket) {
      const key = product.id || 1;
      if (grouped[key]) {
        grouped[key].quantity += 1;
        grouped[key].totalPrice += product.price;
      } else {
        grouped[key] = {
          ...product,
          quantity: 1,
          totalPrice: product.price
        };
      }
    }
    return Object.values(grouped);
  }

  getGroupedBasketOnlyChecked() {
    const grouped: { [key: string]: any } = {};
    for (const product of this.basket) {
      if (!product.checked) continue;
      const key = product.id || '1';
      const priceToAdd = product.promotion ? product.promotionalPrice : product.price;
      if (grouped[key]) {
        grouped[key].quantity += 1;
        grouped[key].totalPrice += priceToAdd;
      } else {
        grouped[key] = {
          ...product,
          quantity: 1,
          totalPrice: priceToAdd
        };
      }
    }
    return Object.values(grouped);
  }

  addToBasket(product: Product) {



    product.checked = true;
    this.popupService.product = product;
    this.addProductToBasket(product);
    this.popupService.showPopup();
  }

  addBuyNowProduct(product: Product) {
    this.basket.forEach(p => p.checked = false);
    product.checked = true;
    this.addProductToBasket(product);
  }
}
