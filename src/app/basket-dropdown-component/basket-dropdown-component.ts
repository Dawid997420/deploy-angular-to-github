import { Component } from '@angular/core';
import { BasketService } from '../services/basket-service';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { MathService } from '../services/math-service';
import { filter } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-basket-dropdown-component',
    imports: [CommonModule, RouterLink],
  templateUrl: './basket-dropdown-component.html',
  styleUrl: './basket-dropdown-component.css'
})
export class BasketDropdownComponent {



  
  showBasket: boolean= false;

  constructor(public basketService: BasketService, public mathService: MathService, public router: Router) {}

  inTheBasket = false;

  ngOnInit() {
  this.router.events.pipe(
    filter(event => event instanceof NavigationEnd)
  ).subscribe((event: NavigationEnd) => {
    const url = event.urlAfterRedirects;
    this.inTheBasket = url === '/koszyk' || url === '/dostawa-i-platnosc';
  });

  // Ustawienie początkowej wartości przy ładowaniu komponentu
  const currentUrl = this.router.url;
  this.inTheBasket = currentUrl === '/koszyk' || currentUrl === '/dostawa-i-platnosc';
}


  getGroupedBasket() {
  const grouped: { [key: string]: any } = {};

  for (const product of this.basketService.basket) {
    const key = product.id || 1; // lub product.name, ale ID jest bezpieczniejsze

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


goToBasket() {
  this.basketService.weAreInTheBasket = true;
}


}
