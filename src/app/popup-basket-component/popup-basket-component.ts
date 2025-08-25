import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, Renderer2, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PopupService } from '../services/popup-service';
import { Subscription } from 'rxjs';
import { BasketService } from '../services/basket-service';
import { MathService } from '../services/math-service';


@Component({
  selector: 'app-popup-basket-component',
    standalone: true,

  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './popup-basket-component.html',
  styleUrl: './popup-basket-component.css'
})
export class PopupBasketComponent implements OnInit, OnDestroy {
  visible = true;
  subscription!: Subscription;


   isPopupVisible = true;

   progress = 50; // wartość od 0 do 100
    test= "lol";

    closePopup() {
    this.visible = false;
            this.renderer.setStyle(document.body, 'overflow', 'auto');
     document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto';
    }


  constructor(public popupService: PopupService,
   public mathService: MathService ,private renderer: Renderer2, public basketService: BasketService) {}

  ngOnInit(): void {
    this.subscription = this.popupService.visiblePopup$.subscribe((visible: boolean) => {
      this.visible = visible;

      if (visible) {
        this.renderer.setStyle(document.body, 'overflow', 'hidden');
      } else {
        this.renderer.setStyle(document.body, 'overflow', 'auto');
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }



  howMuchToFreeDelivery() {
    let value = 7999 - (this.calculatedBasketPriceNumber() * 100 ) ;
    
    return this.displayPrice(value);
  }

  displayPrice(price: number): string {
    const formatted = (price / 100).toFixed(2).replace('.', ',');
    return formatted;
  }


  calculatePercentage() {
    

   let basketValue = this.calculatedBasketPriceNumber() * 100

    if ( this.popupService.product.price >= 7999 ) {
      return 100;
    } else  {
     let procent =  (basketValue / 7999 ) * 100;
     return procent;
    } 
     
  }




  calculatedBasketPriceNumber() {
  const allProducts = this.basketService.getGroupedBasketOnlyChecked();
  
  const fullPrice = allProducts.reduce((sum, product) => {
    if (product.promotion) {
      return sum + (product.promotionalPrice * product.quantity);
    } else {
      return sum + (product.price * product.quantity);
    }
  }, 0);

  return this.mathService.displayPriceNumber(fullPrice);
}



}
