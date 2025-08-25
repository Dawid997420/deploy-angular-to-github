import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Product } from '../model/Product';
import { ProductsService } from '../services/products-service';
import { MathService } from '../services/math-service';

@Component({
  selector: 'app-sprzedawca',
  imports: [RouterModule],
  templateUrl: './sprzedawca.html',
  styleUrl: './sprzedawca.css'
})
export class Sprzedawca {

   products: Product[] = [];

  constructor(public productService: ProductsService,public mathService: MathService) {

  }


  ngOnInit(): void {

   this.productService.getProducts().subscribe( data => {

          this.products = data;

   });

  }

}
