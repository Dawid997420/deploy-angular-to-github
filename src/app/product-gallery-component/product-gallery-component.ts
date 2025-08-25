import { FormsModule } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, EventEmitter, Inject, Input, OnInit, Output, PLATFORM_ID, HostListener } from '@angular/core';

@Component({
  selector: 'app-product-gallery-component',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './product-gallery-component.html',
  styleUrl: './product-gallery-component.css'
})
export class ProductGalleryComponent implements OnInit {

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  selectedIndex = 0;
  currentIndex = 0;
  maxVisible = 5;

  @Input() images: { url: string }[] = [];
  @Output() imageSelected = new EventEmitter<string>();
  @Output() directionSelected = new EventEmitter<number>();

  /** Zwraca tylko widoczne miniaturki */
  get visibleImages() {
    return this.images.slice(this.currentIndex, this.currentIndex + this.maxVisible);
  }

  /** Wybór obrazu */
  selectImage(url: string) {
    const newIndex = this.images.findIndex(img => img.url === url);
    if (newIndex === -1) return;

    const direction = newIndex > this.selectedIndex ? 1 : -1;
    this.selectedIndex = newIndex;

    this.imageSelected.emit(url);
    this.directionSelected.emit(direction);
  }

  /** Następna grupa obrazów */
  next() {
    if (this.currentIndex + this.maxVisible < this.images.length) {
      this.currentIndex++;
      const nextVisibleImage = this.images[this.currentIndex];
      if (nextVisibleImage) {
        this.selectedIndex = this.currentIndex;
        this.imageSelected.emit(nextVisibleImage.url);
        this.directionSelected.emit(1);
      }
    }
  }

  /** Poprzednia grupa obrazów */
  prev() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      const prevVisibleImage = this.images[this.currentIndex];
      if (prevVisibleImage) {
        this.selectedIndex = this.currentIndex;
        this.imageSelected.emit(prevVisibleImage.url);
        this.directionSelected.emit(-1);
      }
    }
  }

  // ----------------- RESPONSYWNOŚĆ -----------------
  ngOnInit(): void {
    this.setMaxVisibleImages();
  }

  @HostListener('window:resize')
  onResize() {
    this.setMaxVisibleImages();
  }

  private setMaxVisibleImages() {
    if (!isPlatformBrowser(this.platformId)) {
      return; // 🔥 w SSR nie ma window
    }

    const width = window.innerWidth;
    if (width < 830) {
      this.maxVisible = 3;
    } else if (width < 1000) {
      this.maxVisible = 4;
    } else {
      this.maxVisible = 5;
    }
  }
}