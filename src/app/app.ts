import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from "./navbar/navbar";

import { FooterComponent } from './footer-component/footer-component';
import { PolitykaPrywatnosciComponent } from './polityka-prywatnosci-component/polityka-prywatnosci-component';
import { RegulaminComponent } from './regulamin-component/regulamin-component';
import { KontaktComponent } from './kontakt-component/kontakt-component'
import { ProductComponent } from './product-component/product-component';
import { PromocjeComponent } from './promocje-component/promocje-component'; // <-- import
import { BasketComponent } from './basket-component/basket-component';
import { PopupBasketComponent } from './popup-basket-component/popup-basket-component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, FooterComponent, RegulaminComponent,KontaktComponent, ProductComponent
    ,PromocjeComponent,BasketComponent, PopupBasketComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('ssr-hoffmanshop');
}
