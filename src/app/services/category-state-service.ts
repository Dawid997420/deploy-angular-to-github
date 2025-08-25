import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class CategoryStateService {
  private isBrowser: boolean;

  showCategories = false;
  chosenCategoryMobile = "";
  categoriesNames = [
    "Dom i ogród", "Dziecko", "Elektronika", "Firma", "Kolekcje i sztuka",
    "Kultura i rozrywka", "Moda", "Motoryzacja", "Sport i turystyka",
    "Supermarket", "Uroda", "Zdrowie"
  ];
  selectedCategories = this.categoriesNames;

  categories = [
    {
      name: 'dom-i-ogrod',
      subcategories: ["Budownictwo i Akcesoria", "Meble", "Narzędzia", "Ogród", "Oświetlenie", "Wyposażenie"],
    },
    { name: 'Dziecko', subcategories: ["Artykuly szkolne","Foteliki samochodowe","Obuwie","Odzież","Pokój dziecięcy","Rowery i pojazdy","Wózki","Zabawki ogrodowe","Zabawki","Zdrowie i higiena","Karmienie dziecka"] },
    { name: 'Elektronika', subcategories: ["Fotografia","Komputery","Konsole i automaty","Rtv i agd","Telefony i akcesoria"] },
    { name: 'Firma', subcategories: ["Biuro i reklama","Przemysł"] },
    { name: 'kolekcje-i-sztuka', subcategories: ["Sztuka","Kolekcje","Rękodzieło"] },
    { name: 'kultura-i-rozrywka', subcategories: ["Gadżety","Gry","Instrumenty","Komiksy"] },
    { name: 'Moda', subcategories: ["Biżuteria i Zegarki","Odzież, Obuwie, Dodatki"] },
    { name: 'sport-i-turystyka', subcategories: ["Bieganie","Kolekcje","Militaria","Rowery i akcesoria","Siłownia i fitness","Sporty ekstremalne","Sporty towarzyskie i rekreacja","Sporty walki","Sporty wodne","Sporty drużynowe","Sporty zimowe","Tenis i pokrewne","Turystyka","Wedkarstwo"] },
    { name: 'Supermarket', subcategories: ["Artykuły dla zwierząt","Produkty spożywcze","Utrzymanie czystości"] },
    { name: 'Uroda', subcategories: ["Makijaż","Perfumy i wody","Manicure i pedicure","Pielęgnacja","Profesjonalne wyposażenie salonów"] },
    { name: 'Zdrowie', subcategories: ["Dermokosmetyki","Domowa apteczka","Higiena jamy ustnej","Higiena osobista","Korekcja wzroku","Medycyna naturalna","Sprzęt i wyposażenie medyczne"] },
  ];

  constructor(private router: Router, @Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  /** Wybor kategorii */
  choseCategory(category: string) {
    const slug = this.slugify(category);

    this.router.navigate(['/category', slug]);

    if (!this.isMainCategory(slug)) {
      this.closeCategories();
    }
  }

  /** Zamkniecie kategorii */
  closeCategories() {
    this.showCategories = false;
    if (this.isBrowser) {
      document.documentElement.style.setProperty('overflow', 'auto', 'important');
      document.body.style.overflow = 'auto';
      document.body.style.marginRight = '0px';
    }
  }

  /** Przełącz widok kategorii */
  toggleCategories(): void {
    this.showCategories = !this.showCategories;

    if (this.isBrowser) {
      const scrollTarget = document.documentElement;
      scrollTarget.style.setProperty('overflow', this.showCategories ? 'hidden' : 'auto', 'important');

      // zapis w localStorage tylko w przeglądarce
      localStorage.setItem("showCategories", JSON.stringify(this.showCategories));

      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      this.selectedCategories = this.categoriesNames;

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

  /** Subkategorie */
  getSubcategoriesByCategoryName(name: string): string[] {
    const category = this.categories.find(cat => cat.name.toLowerCase() === name.toLowerCase());
    return category ? category.subcategories : [];
  }

  selectCategory(name: string): void {
    const slug = this.slugify(name);
    this.chosenCategoryMobile = slug;

    const foundCategory = this.categories.find(cat => this.slugify(cat.name) === slug);
    this.selectedCategories = foundCategory ? foundCategory.subcategories : [];

    if (!this.isMainCategory(slug)) {
      this.closeCategories();
    }
  }

  selectMainCategory(name: string): void {
    const slug = this.slugify(name);
    this.chosenCategoryMobile = slug;

    const foundCategory = this.categories.find(cat => this.slugify(cat.name) === slug);
    this.selectedCategories = foundCategory ? foundCategory.subcategories : [];
    this.closeCategories();
  }

  /** Utils */
  slugify(text: string): string {
    const polishMap: Record<string, string> = {
      'ą': 'a', 'ć': 'c', 'ę': 'e', 'ł': 'l', 'ń': 'n', 'ó': 'o', 'ś': 's', 'ź': 'z', 'ż': 'z',
      'Ą': 'A', 'Ć': 'C', 'Ę': 'E', 'Ł': 'L', 'Ń': 'N', 'Ó': 'O', 'Ś': 'S', 'Ź': 'Z', 'Ż': 'Z'
    };

    return text
      .replace(/[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/g, char => polishMap[char] || char)
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  isMainCategory(category: string): boolean {
    const slugifiedCategories = this.categoriesNames.map(name => this.slugify(name));
    return slugifiedCategories.includes(this.slugify(category));
  }

  formatCategoryName(slug: string): string {
    return slug.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
  }
}