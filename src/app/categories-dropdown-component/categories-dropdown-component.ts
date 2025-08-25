import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CategoryStateService } from '../services/category-state-service';
import { RouterModule } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-categories-dropdown-component',
  imports: [CommonModule, RouterModule],
  templateUrl: './categories-dropdown-component.html',
  styleUrl: './categories-dropdown-component.css'
})
export class CategoriesDropdownComponent {
  categories = [
    {
      name: 'Dom i ogród',
      subcategories: [
        'Budownictwo i Akcesoria',
        'Meble',
        'Narzędzia',
        'Ogród',
        'Oświetlenie',
        'Wyposażenie',
      ],
    },
    { 
      name: 'Dziecko', 
      subcategories: [
        "Artykuly szkolne",
        "Foteliki samochodowe",
        "Obuwie",
        "Odzież",
        "Pokój dziecięcy",
        "Rowery i pojazdy",
        "Wózki",
        "Zabawki ogrodowe",
        "Zabawki",
        "Zdrowie i higiena",
        "Karmienie dziecka"
      ] 
    },
    { name: 'Elektronika', subcategories: ["Fotografia","Komputery","Konsole i automaty","Rtv i agd","Telefony i akcesoria"] },
    { name: 'Firma', subcategories: ["Biuro i reklama","Przemysł"] },
    { name: 'Kolekcje i sztuka', subcategories: ["Sztuka","Kolekcje","Rękodzieło"] },
    { name: 'Kultura i rozrywka', subcategories: ["Gadżety","Gry","Instrumenty","Komiksy"] },
    { name: 'Sport i turystyka', subcategories: ["Bieganie","Kolekcje","Militaria","Rowery i akcesoria","Siłownia i fitness","Sporty ekstremalne","Sporty towarzyskie i rekreacja","Sporty walki","Sporty wodne","Sporty drużynowe","Sporty zimowe","Tenis i pokrewne","Turystyka","Wedkarstwo"] },
    { name: 'Supermarket', subcategories: ["Artykuły dla zwierząt","Produkty spożywcze","Utrzymanie czystości"] },
    { name: 'Uroda', subcategories: ["Makijaż","Perfumy i wody","Manicure i pedicure","Pielęgnacja","Profesjonalne wyposażenie salonów"] },
    { name: 'Zdrowie', subcategories: ["Dermokosmetyki","Domowa apteczka","Higiena jamy ustnej","Higiena osobista","Korekcja wzroku","Medycyna naturalna","Sprzęt i wyposażenie medyczne"] },
  ];

  activeCategory: any = null;
  showDropdown = false;
  showCategories = false;

  categoriesNames = ["Dom i ogród","Dziecko","Elektronika","Firma","Kolekcje i sztuka","Kultura i rozrywka","Moda","Motoryzacja","Sport i turystyka","Supermarket","Uroda","Zdrowie"];
  selectedCategories = this.categoriesNames;

  constructor(
    public categoryService: CategoryStateService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const lastSelected = localStorage.getItem('lastCategorySlug');
      const found = this.categories.find(cat => cat.name === lastSelected);
      this.activeCategory = found || this.categories[0];
    } else {
      this.activeCategory = this.categories[0]; // fallback w SSR
    }
  }

  setActive(cat: any) {
    if (this.activeCategory !== cat) {
      this.activeCategory = cat;
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('lastCategorySlug', cat.slug);
      }
    }
  }

  toggleCategories(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.showCategories = !this.showCategories;
      localStorage.setItem("showCategories", JSON.stringify(this.showCategories));

      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

      if (this.showCategories) {
        document.body.style.overflow = 'hidden';
        document.body.style.marginRight = `${scrollbarWidth}px`;
        document.body.style.backgroundColor = "#f9f9f9";
      } else {
        document.body.style.overflow = 'auto';
        document.body.style.marginRight = '0px';
      }
    }
  }

  trackByIndex(index: number, _: any): number {
    return index;
  }

  selectCategory(name: string): void {
    const foundCategory = this.categories.find(cat => cat.name === name);
    this.selectedCategories = foundCategory ? foundCategory.subcategories : [];
  }

  slugify(text: string): string {
    const polishMap: Record<string, string> = {
      'ą': 'a', 'ć': 'c', 'ę': 'e', 'ł': 'l',
      'ń': 'n', 'ó': 'o', 'ś': 's', 'ź': 'z', 'ż': 'z',
      'Ą': 'A', 'Ć': 'C', 'Ę': 'E', 'Ł': 'L',
      'Ń': 'N', 'Ó': 'O', 'Ś': 'S', 'Ź': 'Z', 'Ż': 'Z'
    };

    const replacePolish = (str: string): string =>
      str.replace(/[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/g, char => polishMap[char] || char);

    return replacePolish(text)
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  isMainCategory(): boolean {
    const slugifiedCategories = this.categoriesNames.map(name => this.slugify(name));
    const chosenSlug = this.categoryService.chosenCategoryMobile;
    return slugifiedCategories.includes(chosenSlug);
  }

  choseCategory(category: string) {
    if (this.categoryService.isMainCategory(category)) {
      // logika jeśli główna kategoria
    } else {
      // logika jeśli podkategoria
    }
  }
}