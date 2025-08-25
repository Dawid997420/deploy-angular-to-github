import { Component, ElementRef, ViewChild, OnInit, AfterViewInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { BasketService } from '../services/basket-service';
import { MathService } from '../services/math-service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Product } from '../model/Product';

@Component({
  selector: 'app-basket-component',
    imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './basket-component.html',
  styleUrl: './basket-component.css'
})
export class BasketComponent implements OnInit, AfterViewInit, OnDestroy {

  groupedBasket: (Product & { quantity: number; totalPrice: number; checked: boolean })[] = [];
  selectAllChecked = true;

  constructor(
    public mathService: MathService,
    public basketService: BasketService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  listaBolean = [true,false];
  ngOnInit(): void {
    // Grupowanie koszyka i ustawianie checked na true
    this.groupedBasket = this.getGroupedBasket();
    this.setSelectAllChecked() ;
  }


  setSelectAllChecked() {
    
    for (let i = 0; i<this.groupedBasket.length ; i++) {
        if ( !this.groupedBasket[i].checked) {
            this.selectAllChecked = false;
        }
    }

  }


  // Grupowanie produktów wg ID, z liczbą i sumą ceny
  getGroupedBasket(): (Product & { quantity: number; totalPrice: number })[] {
  const grouped: { [key: string]: any } = {};

  for (const product of this.basketService.basket) {
    const key = product.id || 1; 

    if (grouped[key]) {
      grouped[key].quantity += 1;

      if (product.promotion) {
        grouped[key].totalPrice += product.promotionalPrice;
      } else {
        grouped[key].totalPrice += product.price;
      }

    } else {
      grouped[key] = {
        ...product,
        quantity: 1,
        totalPrice: product.promotion
          ? product.promotionalPrice
          : product.price
      };
    }
  }

  return Object.values(grouped);
}

  // Toggle checkbox pojedynczego produktu
toggleSelection(product: Product & { checked: boolean }, quantity: number, event: Event): void {
  const checked = (event.target as HTMLInputElement).checked;
  product.checked = checked;

  // Aktualizacja stanu w koszyku
  this.basketService.basket = this.basketService.basket.map(p => {
    if (p.id === product.id) {
      console.log("DZIALA "+ p.id + p.name)
      return { ...p, checked }; // zakładamy, że checked już istnieje
    }
    return p;
  });

  // Aktualizacja selectAllChecked
  this.selectAllChecked = this.groupedBasket.every(p => p.checked);

     this.basketService.updateBasketStorage()

}


 

removeOneProductFromBasket(product: Product) {
  const index = this.basketService.basket.findIndex(p => p.id === product.id);
  if (index !== -1) {
    this.basketService.basket.splice(index, 1); // usuń jedną sztukę
  }
  this.basketService.updateBasketStorage();
  this.basketService.productsInTheBasket = this.basketService.productsInTheBasket - 1;
  this.groupedBasket = this.getGroupedBasket();
  
  this.setSelectAllChecked();
  this.basketService.removeOneProductFromBasket();
}




  // Toggle checkbox "Cały koszyk"
  toggleSelectAll(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.selectAllChecked = checked;

    // Zaznacz/odznacz wszystkie produkty w groupedBasket (do wyświetlenia)
    this.groupedBasket.forEach(product => product.checked = checked);

    // Zaznacz/odznacz wszystkie produkty w koszyku (oryginalne dane)
    this.basketService.basket = this.basketService.basket.map(p => ({
      ...p,
      checked: checked // przypisz true/false do każdego produktu
    }));

    this.basketService.updateBasketStorage();

    this.groupedBasket.forEach(product => product.checked = checked);
  }

  // Oblicz sumę tylko zaznaczonych produktów
  getFullPrice(): number {
    return this.groupedBasket
      .filter(p => p.checked)
      .reduce((sum, p) => sum + p.totalPrice, 0);
  }

  // Wyłącz przycisk jeśli nic nie zaznaczone
  isButtonDisabled(): boolean {
    return this.groupedBasket.filter(p => p.checked).length === 0;
  }

  // Sticky right column - bez zmian
  @ViewChild('rightCol') rightColRef!: ElementRef;
  @ViewChild('basketWrapper') basketWrapperRef!: ElementRef;

  private onScroll = () => {
    const rightCol = this.rightColRef?.nativeElement;
    const basketWrapper = this.basketWrapperRef?.nativeElement;
    const stopTrigger = document.getElementById('footer-trigger');

    if (!rightCol || !basketWrapper || !stopTrigger) return;

    const basketRect = basketWrapper.getBoundingClientRect();
    const triggerRect = stopTrigger.getBoundingClientRect();

    const topLimit = 170;
    const stickyHeight = rightCol.offsetHeight;
    const stickyWidth = basketWrapper.querySelector('.right-column').offsetWidth + 'px';
    const buffer = 0;

    if (triggerRect.top - stickyHeight - topLimit <= buffer) {
      rightCol.style.position = 'absolute';
      rightCol.style.top = 'auto';
      rightCol.style.bottom = '0';
      rightCol.style.width = stickyWidth;
    } else if (basketRect.top > topLimit) {
      rightCol.style.position = 'absolute';
      rightCol.style.top = 'auto';
      rightCol.style.bottom = 'auto';
      rightCol.style.width = 'auto';
    } else {
      rightCol.style.position = 'fixed';
      rightCol.style.top = topLimit + 'px';
      rightCol.style.bottom = 'auto';
      rightCol.style.width = stickyWidth;
    }
  };

   ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.addEventListener('scroll', this.onScroll.bind(this));
      this.onScroll(); // start
    }
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.onScroll);
  }

  chuj= true;
}
