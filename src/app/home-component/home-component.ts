import { Component } from '@angular/core';
import { Product } from '../model/Product';
import { ProductsService } from '../services/products-service';



import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ZaletyComponent } from '../zalety-component/zalety-component';
import { Injectable } from '@angular/core';
// import { PopupService } from '../services/popup-service';
import { HttpClient } from '@angular/common/http';



@Component({
  selector: 'app-home-component',
    imports: [ZaletyComponent, CommonModule, RouterLink],
  templateUrl: './home-component.html',
  styleUrl: './home-component.css'
})
export class HomeComponent {




  
    [x: string]: any;
  

    private apiUrl = 'http://localhost:8080/products'; // Zmień na URL Twojego API
  
    products : Product[] = [];


   constructor( public productService: ProductsService) {}
  

    


    ngOnInit(): void {


      const userAgent = navigator.userAgent;

      console.log("USER AGENT -> " + userAgent)
    
    
      this.productService.getProductsRandom().subscribe(data => {
      this.products = data;
      
      console.log("Produkty z backendu:", data); // 👈 tutaj wyświetlasz dane
      });
      


      console.log("HOME")

    }



    nameConverter(name: string) {


      name =  name.replace(/ /g, '-');
      name =  name.replace(/  /g, '-');
      return name;
    }


    choseProduct(productChosen: Product) {
      // localStorage.setItem('product',  JSON.stringify(productChosen) );
      // window.scrollTo(0, 0);
    }


    displayPrice(price: number): string {
  const formatted = (price / 100).toFixed(2).replace('.', ',');
  return formatted;
}


    getShortName(name: string): string {
    if (!name) return '';
    return name.length > 30 ? name.slice(0, 30) + '...' : name;
    }




    





}
