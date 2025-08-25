import { Component } from '@angular/core';
import { Product } from '../model/Product';
import { ProductsService } from '../services/products-service';
import { MathService } from '../services/math-service';

@Component({
  selector: 'app-panel-produktow',
  imports: [],
  templateUrl: './panel-produktow.html',
  styleUrl: './panel-produktow.css'
})
export class PanelProduktow {



  
    products: Product[] = [];
  
    constructor(public productService: ProductsService,public mathService: MathService) {
  
    }
  
  
    ngOnInit(): void {
  
     this.productService.getProducts().subscribe( data => {
  
            this.products = data;
  
     });
  
    }




    usunProdukt(id: number): void {
        if (confirm('Czy na pewno chcesz usunąć ten produkt?')) {
          this.productService.deleteProductById(id).subscribe(() => {
            this.products = this.products.filter(p => p.id !== id); // odświeżenie listy
          });
        }
    }


  


}
