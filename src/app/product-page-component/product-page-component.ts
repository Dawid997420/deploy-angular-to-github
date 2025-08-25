import { Component } from '@angular/core';
import { ProductsService } from '../services/products-service';
import { Product } from '../model/Product';
import { ActivatedRoute, RouterLink, UrlSegment } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BasketService } from '../services/basket-service';
import { PopupBasketComponent } from '../popup-basket-component/popup-basket-component';
// import { ProductGalleryComponent } from '../product-gallery-component/product-gallery-component';

import { PopupService } from '../services/popup-service';

@Component({
  selector: 'app-product-page-component',
      standalone: true,

    imports: [CommonModule, RouterLink, FormsModule, PopupBasketComponent],
  templateUrl: './product-page-component.html',
  styleUrl: './product-page-component.css'
})
export class ProductPageComponent {



  
  products : Product[] = [];
  
  currentPage : number = 0;
  totalPages: number = 0;
  totalElements: number = 0;

  randomBuyCount: number= 1;
showPopup: boolean = false;


  constructor(public popupService:PopupService ,public basketService:BasketService  ,public productService: ProductsService,   private route: ActivatedRoute) {
    this.randomBuyCount = Math.floor(Math.random() * 20) + 1;


  }


  goToPage() {
  console.log(this.currentPage);

  let categoryName = this.route.snapshot.paramMap.get('name') || '';

  const index = categoryName.indexOf('&');
  if (index !== -1) {
    categoryName = categoryName.substring(0, index);
  }

  this.productService.getProductsByCategory(categoryName, this.currentPage - 1).subscribe(data => {
    this.products = data.products;
    this.totalPages = data.totalPages;
    this.totalElements = data.totalElements;
    this.currentPage = data.currentPage + 1;
    console.log("Produkty z kategorii:" + categoryName, data);
  });
}

  goToPagePlus() {
    this.currentPage = this.currentPage+1;
    this.goToPage();
  }
  
  goToPageMinus() {
    this.currentPage = this.currentPage-1;
    this.goToPage();
  }


  displayPrice(price: number): string {
  const formatted = (price / 100).toFixed(2).replace('.', ',');
  return formatted;
  }

  
 displayPriceNumber(price: number): number {
  return parseFloat((price / 100).toFixed(2));
}

  

   calculateNetto(brutto: number, vatRate: number): string {
  if (vatRate < 0 || vatRate >= 100) throw new Error("Nieprawidłowa stawka VAT");

  return this.displayPrice((brutto / (1 + vatRate / 100)))

  //return +(brutto / (1 + vatRate / 100)).toFixed(2);
  }
  


  ngOnInit(): void {
  this.route.url.subscribe((segments: UrlSegment[]) => {
    const fullPath = segments.map(s => s.path).join('/');

    if (fullPath.startsWith('category')) {
      let categoryName = this.route.snapshot.paramMap.get('name') || '';
      let subName = this.route.snapshot.paramMap.get('subname') || '';

      // Obcinamy wszystko po pierwszym '&' w categoryName
      const catIndex = categoryName.indexOf('&');
      if (catIndex !== -1) {
        categoryName = categoryName.substring(0, catIndex);
      }

      // Obcinamy wszystko po pierwszym '&' w subName
      const subIndex = subName.indexOf('&');
      if (subIndex !== -1) {
        subName = subName.substring(0, subIndex);
      }

      if (subName) {
        this.productService.getProductsByCategory(subName, 0).subscribe(data => {
          this.products = data.products;
          this.totalPages = data.totalPages;
          this.totalElements = data.totalElements;
          this.currentPage = data.currentPage + 1;
          console.log("Produkty z kategorii:" + subName, data);
        });
      } else {
        this.productService.getProductsByCategory(categoryName, 0).subscribe(data => {
          this.products = data.products;
          this.totalPages = data.totalPages;
          this.totalElements = data.totalElements;
          this.currentPage = data.currentPage + 1;
          console.log("Produkty z kategorii:" + categoryName, data);
        });
      }
    } else {
      this.productService.getProducts().subscribe(data => {
        this.products = data;
        console.log("Wszystkie produkty:", data);
      });
    }
  });
}



   getDeliveryDayText(workdaysToAdd: number): string {
  const dayNames = ["niedzielę", "poniedziałek", "wtorek", "środę", "czwartek", "piątek", "sobotę"];
  let currentDate = new Date();
  let addedDays = 0;

  while (addedDays < workdaysToAdd) {
    currentDate.setDate(currentDate.getDate() + 1);
    const day = currentDate.getDay();

    // Pomijamy soboty (6) i niedziele (0)
    if (day !== 0 && day !== 6) {
      addedDays++;
    }
  }

  const deliveryDay = dayNames[currentDate.getDay()];
  return `Dostawa w ${deliveryDay}`;
}



    nameConverter(name: string) {


      name =  name.replace(/ /g, '-');
      name =  name.replace(/  /g, '-');
      return name;
    }



     choseProduct(productChosen: Product) {
      localStorage.setItem('product',  JSON.stringify(productChosen) );
  // Tymczasowo wyłącz smooth scroll (jeśli ustawione w CSS)
  document.documentElement.style.scrollBehavior = 'auto';

  // Teleport na górę
  window.scrollTo(0, 0);
    }

    visiblePopup = false;

    addToBasket(product:Product) {
      

      product.checked= true;
    this.popupService.product = product;
    this.basketService.addProductToBasket(product);  
    this.popupService.showPopup(); // pokaż popup
    }




}
