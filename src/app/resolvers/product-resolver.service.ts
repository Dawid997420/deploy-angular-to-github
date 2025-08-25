import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { ProductsService } from '../services/products-service';
import { Product } from '../model/Product';
import { isPlatformBrowser } from '@angular/common';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductResolver implements Resolve<Product | null> {
  constructor(
    private productService: ProductsService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Product | null> {
    const idParam = route.paramMap.get('id');
    const productId = idParam ? Number(idParam) : null;
    if (!productId) return of(null);

    return this.productService.getProductById(productId).pipe(
      tap(product => {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('product', JSON.stringify(product));
        }
      })
    );
  }
}