import { Component } from '@angular/core';
import { Product } from '../model/Product';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductsService } from '../services/products-service';


@Component({
  selector: 'app-promocje-component',
  imports: [CommonModule, RouterLink],
  templateUrl: './promocje-component.html',
  styleUrl: './promocje-component.css'
})
export class PromocjeComponent {



  
    products : Product[] = [];
    
    constructor(public productService: ProductsService) {

    }


    ngOnInit(): void {


      const userAgent = navigator.userAgent;

      console.log("USER AGENT -> " + userAgent)
    
    
      this.productService.getPromotionProducts().subscribe(data => {
      this.products = data;
      
      console.log("Produkty z backendu:", data); // 👈 tutaj wyświetlasz dane
      });
      


      console.log("HOME")

    }



    choseProduct(productChosen: Product) {
        localStorage.setItem('product',  JSON.stringify(productChosen) );
        window.scrollTo(0, 0);
    }


    
    nameConverter(name: string) {


      name =  name.replace(/ /g, '-');
      name =  name.replace(/  /g, '-');
      return name;
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
