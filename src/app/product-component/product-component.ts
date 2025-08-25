import { Component, Inject, OnInit, PLATFORM_ID, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { filter, Subscription } from 'rxjs';
import { ProductsService } from '../services/products-service';
import { Product } from '../model/Product';
import { Description } from '../model/Description';
import { Section } from '../model/Section';
import { Item } from '../model/Item';

import { BasketService } from '../services/basket-service';
import { ProductGalleryComponent } from '../product-gallery-component/product-gallery-component';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  standalone: true,
  selector: 'app-product-component',
  imports: [RouterLink, CommonModule, ProductGalleryComponent],
  templateUrl: './product-component.html',
  styleUrls: ['./product-component.css'] // <-- poprawione
})
export class ProductComponent implements OnInit, OnDestroy {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    public productService: ProductsService,
    public basketService: BasketService,
    @Inject(PLATFORM_ID) private platformId: Object ,
    private meta: Meta, private title: Title
  ) {}

  product: Product = {
    id: 0,
    name: '',
    description: { id: 1, sections: [] },
    ean: '',
    sku: '',
    externalReferences: [],
    externalAttributes: [],
    externalCategories: [],
    images: [],
    price: 0,
    purchasedCount: 1,
    cataloguePrice: 0,
    referencePriceType: '',
    stock: 0,
    status: '',
    dispatchTime: undefined,
    deliveryPriceList: '',
    weight: 0,
    invoiceType: '',
    checked: true
  };

  quantity = 1;
  chosenImage = '';
  routeSub!: Subscription;
  slideDirection = 1;
  currentIndex = 0;

  touchStartX = 0;
  touchEndX = 0;



  private updateMeta(product: Product) {
  // Tytuł strony
  this.title.setTitle(`${product.name} - Twoja Sklep`);

  // Opis meta
  this.meta.updateTag({
    name: 'description',
    content: this.getFirstTextValue(product.description)
  });

  // Open Graph
  this.meta.updateTag({ property: 'og:title', content: product.name });
  this.meta.updateTag({ property: 'og:description', content: this.getFirstTextValue(product.description) });
  this.meta.updateTag({ property: 'og:image', content: product.images[0]?.url || '' });

  // Twitter Card
  this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
}


  private getFirstTextValue(description:Description ):string {

    let opis ="";

    for ( let i =0 ; i < this.product.description.sections.length; i++) {
      
      let section: Section = this.product.description.sections[i];

      if ( section.items.length == 1) {

        let item: Item = section.items[0];


        if ( item.type=="TEXT") {
        opis = item.content;
        return opis;
        }

      } else if ( section.items.length == 2) {


        let item1: Item = section.items[0];
        let item2: Item = section.items[1];

        if ( item1.type=="TEXT") {
          opis = item1.content;
          return opis;
        }

          if ( item2.type=="TEXT") {
          opis = item2.content;
          return opis;
        }
 

      }

    }

    return opis;

  }


  /** Pobranie ID produktu z URL (SSR-safe) */
  private getProductIdFromUrl(): number | null {


    if (!isPlatformBrowser(this.platformId)) {
      // SSR – pobieramy ID produktu z paramMap zamiast window.location
      const paramId = this.route.snapshot.paramMap.get('id');
      return paramId ? Number(paramId) : null;
    }

    // Browser – klasyczne pobranie z URL
    const url = window.location.href;
    const lastSegment = url.substring(url.lastIndexOf('/') + 1);

    const index = lastSegment.lastIndexOf('-');
    if (index === -1) return null;

    const num = Number(lastSegment.substring(index + 1));
    
    console.log("TO JEST IDDD" + num)
    
    return isNaN(num) ? null : num;
  }

  /** Ładowanie produktu (SSR-safe z localStorage fallbackiem) */
  /** Ładowanie produktu (SSR + localStorage fallback dla przeglądarki) */
private loadProductById(productId: number) {
  // Próbujemy pobrać produkt z localStorage tylko w przeglądarce
  if (isPlatformBrowser(this.platformId)) {
    const storedProduct = localStorage.getItem('product');
    const parsedProduct: Product | null = storedProduct ? JSON.parse(storedProduct) : null;

    if (parsedProduct && parsedProduct.id === productId) {
      this.product = parsedProduct;
      this.chosenImage = this.product.images[0]?.url || '';
      this.updateMeta(this.product); // Meta tagi też ustawiamy
      return;
    }
  }

  // Pobranie produktu z API (działa SSR i browser)
  this.productService.getProductById(productId).subscribe(product => {
    this.product = product;
    this.chosenImage = product.images[0]?.url || '';

    // Aktualizacja meta tagów SSR
    this.updateMeta(product);

    // Zapis w localStorage tylko w przeglądarce
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('product', JSON.stringify(product));
    }
  });
}

  // ----------------- LIFECYCLE -----------------
 ngOnInit(): void {
  console.log("DZIALAAAA J");

  // Pierwsze ładowanie
  const productId = this.getLastNumberFromCurrentUrl();
  console.log("INITIAL PRODUCT ID ->", productId);
  if (productId) this.loadProductById(productId);

  // Subskrypcja zmian URL w SPA
  this.routeSub = this.router.events
    .pipe(filter(event => event instanceof NavigationEnd))
    .subscribe(() => {
      const newId = this.getLastNumberFromCurrentUrl();
      console.log("PRODUCT ID ON NAVIGATION ->", newId);
      if (newId) this.loadProductById(newId);
    });
}

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
  }

  // ----------------- QUANTITY -----------------
  incrementQuantity(): void {
    if (this.quantity < Number(this.product.stock)) {
      this.quantity++;
    }
  }

  decrementQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  // ----------------- IMAGE GALLERY -----------------
  choseImage(url: string, direction: number = 1) {
    this.slideDirection = direction;
    this.chosenImage = '';
    setTimeout(() => this.chosenImage = url, 10);
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.product.images.length;
    this.slideDirection = 1;
    this.updateImage();
  }

  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.product.images.length) % this.product.images.length;
    this.slideDirection = -1;
    this.updateImage();
  }

  updateImage() {
    this.chosenImage = this.product.images[this.currentIndex]?.url || '';
  }

  // ----------------- HELPERS -----------------
  displayPrice(price: number) {
    return (price / 100).toFixed(2);
  }

  sanitizeHtml(content: string): SafeHtml {
    const replacements: [RegExp, string][] = [
      [/<h1>/gi, '<h2>'], [/<\/h1>/gi, '</h2>'],
      [/<h2>/gi, '<h3>'], [/<\/h2>/gi, '</h3>'],
      [/<h3>/gi, '<h4>'], [/<\/h3>/gi, '</h4>'],
      [/<h4>/gi, '<h5>'], [/<\/h4>/gi, '</h5>'],
      [/<h5>/gi, ''],     [/<\/h5>/gi, '']
    ];
    let converted = content;
    for (const [pattern, replacement] of replacements) {
      converted = converted.replace(pattern, replacement);
    }
    return this.sanitizer.bypassSecurityTrustHtml(converted);
  }

  // ----------------- SWIPE -----------------
  onTouchStart(event: TouchEvent) {
    if (!isPlatformBrowser(this.platformId)) return;
    this.touchStartX = event.changedTouches[0].screenX;
  }

  onTouchEnd(event: TouchEvent) {
    if (!isPlatformBrowser(this.platformId)) return;
    this.touchEndX = event.changedTouches[0].screenX;
    this.handleSwipe();
  }

  private handleSwipe() {
    const delta = this.touchStartX - this.touchEndX;
    const threshold = 50;

    if (delta > threshold) this.next();
    else if (delta < -threshold) this.prev();
  }

  onImageLoad() {
    setTimeout(() => this.slideDirection = 0, 300);
  }





  
  getLastNumberFromCurrentUrl(): number | null {
  const paramId = this.route.snapshot.paramMap.get('id');
  if (!paramId) return null;

  const num = Number(paramId);
  console.log("ID Z URL:", num);
  return isNaN(num) ? null : num;
}



test1() {
  const btn = document.getElementById("dodaj-do-koszyka");
  if (btn) {
    btn.style.backgroundColor = "red"; // 🔴 zmiana koloru tła
    btn.style.color = "white"; // opcjonalnie kolor tekstu
  }
}


}