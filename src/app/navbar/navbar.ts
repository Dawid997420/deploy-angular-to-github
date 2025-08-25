import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BasketService } from '../services/basket-service';
import { CategoriesDropdownComponent } from '../categories-dropdown-component/categories-dropdown-component';
import { CategoryStateService } from '../services/category-state-service';
import { KeycloakService } from '../keycloak/keycloak.service';
import { BasketDropdownComponent } from '../basket-dropdown-component/basket-dropdown-component';

@Component({
  selector: 'app-navbar',
    imports: [RouterLink, CategoriesDropdownComponent, CommonModule, BasketDropdownComponent],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {

  isLoggedIn = false;

  // keycloak = injectKeycloakService(); // 👈 dostęp do Keycloak




  constructor( public keycloakService: KeycloakService ,public basketService: BasketService , public categoryService: CategoryStateService) {

  }

  showBasket: boolean = false;
isLogged: boolean = false;
  showCategories: boolean = false;
     ngOnInit() {
    // Subskrybujemy zmiany
    // this.keycloakService.isLogged$.subscribe(logged => {
    //   this.isLogged = logged;
    //   console.log('Zalogowany:', logged);
    // });

    // Inicjalizujemy Keycloak (jeśli nie robisz tego globalnie)
  }


  async login() {
    this.keycloakService.login();
  }



 async logout() {
    this.keycloakService.logout();
  }


  goToBasket() {
  this.basketService.weAreInTheBasket = true;
}

  



}
