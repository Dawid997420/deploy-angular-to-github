import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MathService {
  


  
  constructor() { }



  
    displayPrice(price: number): string {

  const formatted = (price / 100).toFixed(2).replace('.', ',');
 
 
  return formatted;
  }

 displayPriceNumber(price: number): number {
  return parseFloat((price / 100).toFixed(2));
}



}
