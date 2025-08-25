import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CategoryStateService } from '../services/category-state-service';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductPageComponent } from '../product-page-component/product-page-component';

@Component({
  selector: 'app-category-page-component',
    imports: [CommonModule, FormsModule, ProductPageComponent, RouterModule],
  templateUrl: './category-page-component.html',
  styleUrl: './category-page-component.css'
})
export class CategoryPageComponent {

  

  categoryName: string = "";
  subName: string = "";

  freeShipping: boolean = false;

  DostawaJutro: boolean = false;

  DostawaPojutrze: boolean = false;
  Faktura: boolean = false;

  Promocje: boolean = false;
  NajnizszaCena: boolean = false;


  selectedSubcategory: string  = "";

  selectSubCategory(name:string) {
    this.selectedSubcategory = name;
  }



  constructor(public route: ActivatedRoute,
      public categoryStateService: CategoryStateService
  ) {}

  subcategories: string[] = ["elo","xd"];



  slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+|-+$/g, '');
}



  capitalizeFirstLetter(str: string): string {
  if (!str) return str; // zabezpieczenie przed pustym stringiem
  return str.charAt(0).toUpperCase() + str.slice(1);
  }




  priceFrom: number = 0;
  priceTo: number = 0;

 ngOnInit(): void {
  this.route.params.subscribe(params => {
    let rawName = params['name'] || '';

    // Obcinamy wszystko po pierwszym '&' jeśli jest
    const index = rawName.indexOf('&');
    if (index !== -1) {
      rawName = rawName.substring(0, index);
    }

    this.categoryName = rawName;

    const subName = params['subname']; // jeśli masz też subname jako parametr

    if (subName) {
      this.subName = subName;
      this.selectedSubcategory = this.subName;
    }

    this.subcategories = this.categoryStateService.getSubcategoriesByCategoryName(this.categoryName);

    console.log('Aktualna kategoria:', this.categoryName);
    console.log('Podkategorie:', this.subcategories);
  });
}


}
