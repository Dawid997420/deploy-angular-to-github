import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductPageResponse } from '../dto/ProductPageResponse';
import { Product } from '../model/Product';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  


  
  uploadImage(file: File) {
    throw new Error('Method not implemented.');
  }
  private apiUrl = 'https://hoffman-shop-v0-production.up.railway.app/products'; // twój backend endpoint

  // private apiUrl = 'http://localhost:8081/products'; // twój backend endpoint

  
  constructor(public http: HttpClient) { }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

   getProductsRandom(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl + "/random");
  }



  getPromotionProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl + "/promotions");
  }



  getProductsByCategory(catName: string, page: number): Observable<ProductPageResponse>  {

  return this.http.get<ProductPageResponse>(`${this.apiUrl}/category/${catName}` + "?page=" + page);
  }



  getProductById(id: number ) {
    return this.http.get<Product>(`${this.apiUrl}/id/${id}`);

  }


    addProduct(product: Product): Observable<any> {
     // const apiUrl = 'http://localhost:8081/products';
      const apiUrl = 'https://hoffman-shop-v0-production.up.railway.app/products';

      return this.http.post(apiUrl, product);
    }



    
uploadImagesFromBase64(base64List: string[]): Observable<string[]> {
 /// return this.http.post<string[]>('http://localhost:8081/r2/upload-base64', base64List);
    return this.http.post<string[]>('https://hoffman-shop-v0-production.up.railway.app/r2/upload-base64', base64List);

}



deleteProductById(id: number): Observable<void> {
  return this.http.delete<void>(`https://hoffman-shop-v0-production.up.railway.app/products/${id}`);
}





}
