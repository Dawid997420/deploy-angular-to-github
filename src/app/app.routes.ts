import { Routes } from '@angular/router';
import { HomeComponent } from './home-component/home-component';
import { PolitykaPrywatnosciComponent } from './polityka-prywatnosci-component/polityka-prywatnosci-component';
import { RegulaminComponent } from './regulamin-component/regulamin-component';
import { ProductComponent } from './product-component/product-component';
import { PromocjeComponent } from './promocje-component/promocje-component'; // <-- import
import { BasketComponent } from './basket-component/basket-component';

import { KontaktComponent } from './kontakt-component/kontakt-component'
import { CategoryPageComponent } from './category-page-component/category-page-component';
import { DeliveryPaymentComponent } from './delivery-payment-component/delivery-payment-component';
import { Sprzedawca } from './sprzedawca/sprzedawca';
import { DodajProdukt2 } from './dodaj-produkt2/dodaj-produkt2';
import { PanelProduktow } from './panel-produktow/panel-produktow';
import { ProductResolver } from './resolvers/product-resolver.service';

export const routes: Routes = [
  { path: '', component: HomeComponent },   // domyślnie HomeComponent
  { path: 'about', component: HomeComponent },
  { path: 'polityka-prywatnosci', component: PolitykaPrywatnosciComponent }, // Ścieżka dla sekcji 'contact'
  { path: 'regulamin', component: RegulaminComponent }, // Ścieżka dla sekcji 'contact'
  { path: 'kontakt', component: KontaktComponent }, // Ścieżka dla sekcji 'contact'
  { path: 'koszyk'  , component: BasketComponent},
  { path: 'category/:name', component: CategoryPageComponent },
  { path: 'category/:name/:subname', component: CategoryPageComponent },

  { path: 'product/:id',
    component: ProductComponent,
      resolve: { product: ProductResolver } // <--- tutaj


   }, // Ścieżka dla sekcji 'contact'
  { path: 'product/:name/:id',component: ProductComponent }, // Ścieżka dla sekcji 'contact'

  { path: 'promocje', component: PromocjeComponent }, // Ścieżka dla sekcji 'contact'

  { path: 'dostawa-i-platnosc'  , component: DeliveryPaymentComponent},


       {
    path: "sprzedawca",
    component: Sprzedawca,
    canActivate: [
        // authGuard

    ],

    children: [
        { path: "dodaj-produkt", component: DodajProdukt2 },
        { path: "panel-produktow", component: PanelProduktow },
        { path: "", redirectTo: "panel-produktow", pathMatch: "full" }
    ]

    },


  { path: '**', redirectTo: '' },           // fallback dla nieznanych ścieżek


];