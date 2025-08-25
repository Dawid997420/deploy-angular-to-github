import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OrderRequestDto } from '../dto/OrderRequestDto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  

  
     private apiUrl = 'https://hoffman-shop-v0-production.up.railway.app/api/orders'; // twój backend endpoint
    //private apiUrl = 'http://localhost:8081/api/orders'

    constructor(private http: HttpClient) { }
     

    createOrder(orderRequest: OrderRequestDto): Observable<any> {
      //const apiUrl = 'https://hoffman-shop-v0-production.up.railway.app/products';
      return this.http.post(this.apiUrl, orderRequest);
    }
       


}
