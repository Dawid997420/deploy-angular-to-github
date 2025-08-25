import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { BasketService } from '../services/basket-service';
import { MathService } from '../services/math-service';
import { OrderService } from '../services/order-service';
import { OrderRequestDto } from '../dto/OrderRequestDto';
import { ProductDto } from '../dto/ProductDto';
import { PaymentMethodComponent } from '../payment-method-component/payment-method-component';
import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';


declare var InPostGeoWidget: any; // 👈 to pozwala użyć globalnego widgetu
declare var apaczkaMap: any;

declare var pocztaPolska: any;



@Component({
  selector: 'app-delivery-payment-component',
  imports: [CommonModule, FormsModule, RouterLink, PaymentMethodComponent],
  templateUrl: './delivery-payment-component.html',
  styleUrl: './delivery-payment-component.css'
})
export class DeliveryPaymentComponent {



  
  constructor(
      @Inject(PLATFORM_ID) private platformId: Object,
    public mathService: MathService ,public basketService: BasketService,
    private cdr: ChangeDetectorRef, public orderService: OrderService
  ) {

  }



      private getFromStorage(key: string): string | null {
      if (isPlatformBrowser(this.platformId)) {
        return localStorage.getItem(key);
      }
      return null;
      }

     private setInStorage(key: string, value: string): void {
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem(key, value);
      }
     }
      

  kosztDostawy = 0;


  selectedPunktRadio= false;
  
  selectedPoint: any = null;
  selectedPointPoczta: any = null;



  checkboxChecked: boolean = false;

  lastSelected: string = "";


  deliveryMethod: string = "";


  checkboxCheckedPocztaPolska: boolean = false;


  orlenPaczka = false;

  dpdPickup = false;



    onOrlenSelected() {
    if (this.orlenPaczka) {
      this.dpdPickup = false;
    }
    }

onDpdSelected() {
  if (this.dpdPickup) {
    this.orlenPaczka = false;
  }
} 



getValuesFromLocalStorage() {
this.lastSelected = this.getFromStorage("lastSelected") || "";
  // 1. Zczytaj z localStorage jeśli istnieje
  const saved = this.getFromStorage('selectedPaczkomat');

  const savedPoczta = this.getFromStorage("selectedPoczta")

  if (saved && this.lastSelected == "Inpost") {
    try {
      this.selectedPoint = JSON.parse(saved);
        if (this.selectedPoint) {
        this.checkboxChecked = true; // <-- tutaj zaznacz checkbox
      }
    } catch (e) {
      console.warn('Błąd parsowania zapisanego punktu:', e);
    }
  } else if ( savedPoczta 
    // && this.lastSelected == "pocztaPolska" 
  ) {
    
    try {
      this.selectedPointPoczta = JSON.parse(savedPoczta);
        if ( this.selectedPointPoczta ) {
        this.checkboxCheckedPocztaPolska = true;
      }
    } catch (e) {
      console.warn('Błąd parsowania zapisanego punktu:', e);
    }

  }

}



  createOrder(form: NgForm) {
    

    const daneSection = document.getElementById("dane");

    
  if (!form.valid) {
        this.showFormPopup() ;

          if ( daneSection ) { 
                  daneSection.scrollIntoView({ behavior: 'smooth' });
          }

      Object.values(form.controls).forEach(control => {
    control.markAsTouched();
  });

    return;
  }

  if (!this.isInvoiceValid()) {
    alert('Uzupełnij dane do faktury.');
    return;
  }


  if (this.deliveryMethod.length <= 1) {

    const deliverySelection = document.getElementById("delivery");
    if ( deliverySelection ) {

      deliverySelection.scrollIntoView({ behavior: 'smooth' });

       this.dostawZostalaWybrana(false) ;

      return
    }
  } 


  let paymentMethod = this.getFromStorage("paymentMethod") || "";

  if ( paymentMethod.length < 1) {

    const paymentSelection = document.getElementById("payment");
    if ( paymentSelection ) {
      this.showPaymentPopup();
      paymentSelection.scrollIntoView({ behavior: 'smooth' });
      
    }
  } else { 

    if (paymentMethod == "payU") {
    


      this.createOrderPayU();
    }



    console.log(      this.basketService.getGroupedBasketOnlyChecked())

  }


    

  // ✅ Tu zamówienie może zostać złożone
 // console.log('Zamówienie utworzone!');
}


  mapToProductDtoList(objects: any[]) {
  let productDtos: ProductDto[] = [];

  for (let i = 0; i < objects.length; i++) {
    let obj = objects[i];
    let price = obj.promotion ? obj.promotionalPrice : obj.price;

    for (let qty = 0; qty < (obj.quantity || 1); qty++) {
      let productDto: ProductDto = {
        id: obj.id,
        name: obj.name,
        price: price
      };
      productDtos.push(productDto);
    }
  }

  return productDtos;
}


  getDeliveryMethod(): string {

    if ( this.checkboxDHLKurier ) {

      return "DHL Kurier";
    } else if ( this.checkboxPocztexKurier ) {
      
      return "Pocztex Kurier";
    } else if ( this.checkboxInpostKurier) {

      return "Inpost Kurier";
    }



    if ( this.deliveryMethod == "POCZTA_POLSKA") {

      return "POCZTA_POLSKA";
    } else if ( this.deliveryMethod =="PACZKOMAT") {
      
      return "PACZKOMAT";
    }


    return "error kurier";
  }




  getSelectedAccessPoint() : string {
   
    let deliveryMethod = this.getDeliveryMethod(); 

    let accessPoint = "";

    if ( deliveryMethod == "PACZKOMAT" ) {

      accessPoint = this.selectedPaczkomat.foreign_access_point_id + " " + 
      this.selectedPaczkomat.street + " " + this.selectedPaczkomat.house_number +
      this.selectedPaczkomat.city + " " + this.selectedPaczkomat.postal_code 

      return accessPoint;
    } else if ( deliveryMethod == "POCZTA_POLSKA" ) {
      
      accessPoint = this.selectedPointPoczta.foreign_access_point_id + " " + 
      this.selectedPointPoczta.street + " " + this.selectedPointPoczta.house_number +
      this.selectedPointPoczta.city + " " + this.selectedPointPoczta.postal_code 

      return accessPoint;
    } else {

      return this.formData.street + " " + this.formData.houseNumber +  "/" + this.formData.apartment + " "   +
        this.formData.city + " " +  this.formData.postalCode ;
    }



   




  }



  createOrderPayU() {


   let productDtos = this.mapToProductDtoList(this.basketService.getGroupedBasketOnlyChecked())
   
console.log("DTOS " + JSON.stringify(productDtos, null, 2));

  let orderRequest : OrderRequestDto= {
    name: this.formData.firstName,
    surname: this.formData.lastName,
    street: this.formData.street,
    houseNumber: this.formData.houseNumber,
    apartNumber: this.formData.apartment,
    postalCode: this.formData.postalCode,
    city: this.formData.city,
    phoneNumber: this.formData.phone,
    email: this.formData.email,
    amount: this.calculateAmount(productDtos),
    productList: productDtos,
    deliveryMethod: this.getDeliveryMethod(),
    accessPoint: this.getSelectedAccessPoint()
  }
  this.orderService.createOrder(orderRequest).subscribe({
      next: (response) => {
        console.log('Zamówienie utworzone:', response);
     window.location.assign(response.redirectUrl);

        
      },
      error: (err) => {
        console.error('Błąd podczas tworzenia zamówienia:', err);
      }
  });


  }


 showPaczkomatPopup() {
  const popup = document.getElementById('paczkomat-popup');
  if (popup) {
    popup.classList.add('show');

    setTimeout(() => {
      popup.classList.remove('show');
    }, 3000); // znika po 3 sekundach
  }
}


calculateAmount(products: any[]): string {
  let total = 0;

  products.forEach(p => {
    console.log(`${p.name} - ${p.price} zł`);  // pokazuje każdy produkt i jego cenę
    total += p.price;
  });

  console.log("Suma cen: " + total + " zł");

  if ( total < 7999) {
   total = total + (this.kosztDostawy *100);
  }

  return total.toString();
}



 dostawZostalaWybrana(wybrana:boolean) {

     const wybierzDostawe = document.getElementById("wybierz-dostawe");

  if (wybrana) {

      this.setInStorage("deliveryMethod", this.deliveryMethod);


      if (wybierzDostawe) {
        wybierzDostawe.style.display = "none";
      }


  } else {

      if (wybierzDostawe) {
          this.showDeliveryPopup();
        wybierzDostawe.style.display = "block";
      }

  }

 }



 showPaymentPopup() {
  const popup = document.getElementById('payment-popup');
  if (popup) {
    popup.classList.add('show');
    setTimeout(() => {
      popup.classList.remove('show');
    }, 3000); // Popup znika po 3 sekundach
  }
}




 showDeliveryPopup() {
  const popup = document.getElementById('delivery-popup');
  if (popup) {
    popup.classList.add('show');

    setTimeout(() => {
      popup.classList.remove('show');
    }, 3000); // Znika po 3 sekundach
  }
}



  showFormPopup() {
  const popup = document.getElementById('form-popup');
  if (popup) {
    popup.classList.add('show');

    setTimeout(() => {
      popup.classList.remove('show');
    }, 3000); // ukryj po 3 sekundach
  }
}



isInvoiceValid(): boolean {
  if (!this.wantInvoice) return true;

  if (this.invoiceType === 'company') {
    const i = this.formData.invoice;
    return !!(i.nip && i.companyName && i.companyStreet && i.companyHouseNumber && i.companyPostalCode && i.companyCity);
  }

  if (this.invoiceType === 'private') {
    const i = this.formData.invoice;
    return !!(i.privateFirstName && i.privateLastName && i.privateStreet && i.privateHouseNumber && i.privatePostalCode && i.privateCity);
  }

  return false;
}



  checkByDeliveryMethod() {

    if(this.deliveryMethod =="PACZKOMAT") {
      this.inpostPaczka = true;

       if ( this.calculatedBasketPriceNumber() >= 79.99 ) {
       
          this.kosztDostawy = 0.0;
          this.setInStorage("kosztDostawy", "0.0");
        
        } else {
        
          this.kosztDostawy = 11.99;
          this.setInStorage("kosztDostawy", "11.99");
      
        }

    } else if ( this.deliveryMethod =="POCZTA_POLSKA") {


       if ( this.calculatedBasketPriceNumber() >= 79.99 ) {
       
          this.kosztDostawy = 0.0;
          this.setInStorage("kosztDostawy", "0.0");
        
        } else {
        
          this.kosztDostawy = 10.99;
          this.setInStorage("kosztDostawy", "10.99");
      
        }

      this.pocztaPolska = true;
    } else if ( this.deliveryMethod =="INPOST_KURIER") {


       if ( this.calculatedBasketPriceNumber() >= 79.99 ) {
       
          this.kosztDostawy = 0.0;
          this.setInStorage("kosztDostawy", "0.0");
        
        } else {
        
          this.kosztDostawy = 11.99;
          this.setInStorage("kosztDostawy", "11.99");
      
        }


      this.checkboxInpostKurier = true; 
    } else if ( this.deliveryMethod =="POCZTEX_KURIER") {


       if ( this.calculatedBasketPriceNumber() >= 79.99 ) {
       
          this.kosztDostawy = 0.0;
          this.setInStorage("kosztDostawy", "0.0");
        
        } else {
        
          this.kosztDostawy = 9.99;
          this.setInStorage("kosztDostawy", "9.99");
      
        }

      this.checkboxPocztexKurier = true;
    } else if ( this.deliveryMethod == "DHL_KURIER") {


       if ( this.calculatedBasketPriceNumber() >= 79.99 ) {
       
          this.kosztDostawy = 0.0;
          this.setInStorage("kosztDostawy", "0.0");
        
        } else {
        
          this.kosztDostawy = 12.99;
          this.setInStorage("kosztDostawy", "12.99");
      
        }

      this.checkboxDHLKurier = true;
     } 

  }



  getKosztDostawy() {
  const stored = this.getFromStorage("kosztDostawy");
  this.kosztDostawy = stored ? Number(stored) : 0;
  }



  ngOnInit() {

 this.getKosztDostawy() ;


    this.pobierzOstatniePunktyOdbioru();




    this.deliveryMethod = this.getFromStorage("deliveryMethod")    || "";

    this.checkByDeliveryMethod() ;


    this.loadFormDataFromStorage();

  this.lastSelected = this.getFromStorage("lastSelected") || "";
  // 1. Zczytaj z localStorage jeśli istnieje
  const saved = this.getFromStorage('selectedPaczkomat') || "";

  const savedPoczta = this.getFromStorage("selectedPoczta") || ""

  if (saved && this.lastSelected == "Inpost") {
    try {
      this.selectedPoint = JSON.parse(saved);
        if (this.selectedPoint) {
        this.checkboxChecked = true; // <-- tutaj zaznacz checkbox
      }
    } catch (e) {
      console.warn('Błąd parsowania zapisanego punktu:', e);
    }
  } else if ( savedPoczta 
    // && this.lastSelected == "pocztaPolska" 
  ) {
    
    try {
      this.selectedPointPoczta = JSON.parse(savedPoczta);
        if ( this.selectedPointPoczta ) {
        this.checkboxCheckedPocztaPolska = true;
      }
    } catch (e) {
      console.warn('Błąd parsowania zapisanego punktu:', e);
    }

  }




  

    (window as any).onPocztaSelected = (record: any) => {
      this.selectedPoint = "POCZTA_POLSKA"
    this.selectedPointPoczta = record;

    // wymuś update widoku
      this.cdr.detectChanges();
    // Zapisz w localStorage
      this.setInStorage('selectedPoczta', JSON.stringify(record));

      if ( record != undefined && record != null) {
      }

  };
  
  


    // 2. Obsłuż callback z JS
  (window as any).onPaczkomatSelected = (record: any) => {
    this.selectedPaczkomat = record;
      this.selectedPoint = "PACZKOMAT"

    // wymuś update widoku
      this.cdr.detectChanges();
    // Zapisz w localStorage
      this.setInStorage('selectedPaczkomat', JSON.stringify(record));

      if ( record != undefined && record != null) {
      }
  };








   



}


  formData = {
  firstName: '',
  lastName: '',
  street: '',
  houseNumber: '',
  apartment: '',
  postalCode: '',
  city: '',
  phone: '',
  email: '',
  invoice: {
    type: '',
    nip: '',
    companyName: '',
    companyStreet: '',
    companyHouseNumber: '',
    companyApartment: '',
    companyPostalCode: '',
    companyCity: '',
    privateFirstName: '',
    privateLastName: '',
    privateStreet: '',
    privateHouseNumber: '',
    privateApartment: '',
    privatePostalCode: '',
    privateCity: ''
  }
};



  wantInvoice:boolean = false;



token = 'YOUR_TOKEN';     // Generate YOUR_TOKEN on https://manager.paczkomaty.pl (for production environment) or https://sandbox-manager.paczkomaty.pl (for sandbox environment).
  identifier = 'Geo1';      // Html element identifier, default: 'Geo1'
  language = 'pl';          // Language, default: 'pl'
  config = 'parcelcollect'; // Config, default: 'parcelcollect'
  sandbox = false;          // Run as sandbox environment, default: false


  pointSelect(point: any) {    
    console.log('Object of selected point: ', point);
  }

  apiReady(api:any) {
    // You can also use API Methods, as example
    api.changePosition({ longitude: 20.318968, latitude: 49.731131 }, 16);
  }  


invoiceType: string = "company";


  

calculatedBasketPrice() {
  const allProducts = this.basketService.getGroupedBasketOnlyChecked();
  
  const fullPrice = allProducts.reduce((sum, product) => {
    if (product.promotion) {
      return sum + (product.promotionalPrice * product.quantity);
    } else {
      return sum + (product.price * product.quantity);
    }
  }, 0);

  return this.mathService.displayPrice(fullPrice);
}


calculatedBasketPriceNumber() {
  const allProducts = this.basketService.getGroupedBasketOnlyChecked();
  
  const fullPrice = allProducts.reduce((sum, product) => {
    if (product.promotion) {
      return sum + (product.promotionalPrice * product.quantity);
    } else {
      return sum + (product.price * product.quantity);
    }
  }, 0);

  return this.mathService.displayPriceNumber(fullPrice);
}



choseOtherPaczkomat() {
         apaczkaMap.show({});

}

choseOtherPunkt() {
              pocztaPolska.show({});
}


@ViewChild('apaczkaLink') apaczkaLink!: ElementRef<HTMLAnchorElement>;

onPaczkomatSelected() {
  if (this.inpostPaczka) {
        this.selectedPoint ="PACZKOMAT"

        this.deliveryMethod = "PACZKOMAT"

        if ( this.calculatedBasketPriceNumber() >= 79.99 ) {
       
          this.kosztDostawy = 0.0;
          this.setInStorage("kosztDostawy", "0.0");
        
        } else {
        
          this.kosztDostawy = 11.99;
          this.setInStorage("kosztDostawy", "11.99");
      
        }
      


        this.dostawZostalaWybrana( true);

      this.pocztaPolska = false;
        this.checkboxInpostKurier = false;
    this.checkboxDHLKurier = false;
    this.checkboxPocztexKurier = false;
  } else {
    this.deliveryMethod = "";
    this.setInStorage("deliveryMethod","");
  }


  apaczkaMap.show({});




}





pobierzOstatniePunktyOdbioru() {

    const selectedPoczta = this.getFromStorage('selectedPoczta');
    if (selectedPoczta) {
      this.selectedPointPoczta = JSON.parse(selectedPoczta); 


       if ( this.calculatedBasketPriceNumber() >= 79.99 ) {
       
          this.kosztDostawy = 0.0;
          this.setInStorage("kosztDostawy", "0.0");
        
        } else {
        
          this.kosztDostawy = 10.99;
          this.setInStorage("kosztDostawy", "10.99");
      
        }

      
    }
    const selectedPaczkomat = this.getFromStorage('selectedPaczkomat');
    
    if ( selectedPaczkomat) {
      this.selectedPaczkomat = JSON.parse(selectedPaczkomat);



       if ( this.calculatedBasketPriceNumber() >= 79.99 ) {
       
          this.kosztDostawy = 0.0;
          this.setInStorage("kosztDostawy", "0.0");
        
        } else {
        
          this.kosztDostawy = 11.99;
          this.setInStorage("kosztDostawy", "11.99");
      
        }


    }

  }





@ViewChild('apaczkaLink') apaczkaLinkPocztaPolska!: ElementRef<HTMLAnchorElement>;


onPocztaPolskaSelected() {

  if (this.pocztaPolska) {
    this.selectedPoint ="POCZTA_POLSKA"
            this.dostawZostalaWybrana( true);
        this.deliveryMethod = "POCZTA_POLSKA"


          if ( this.calculatedBasketPriceNumber() >= 79.99 ) {
       
          this.kosztDostawy = 0.0;
          this.setInStorage("kosztDostawy", "0.0");
        
        } else {
        
          this.kosztDostawy = 10.99;
          this.setInStorage("kosztDostawy", "10.99");
      
        }
      

        this.setInStorage("deliveryMethod", "POCZTA_POLSKA");
    this.inpostPaczka = false;
    this.checkboxInpostKurier = false;
    this.checkboxDHLKurier = false;
    this.checkboxPocztexKurier = false;
  } else {
    this.deliveryMethod = "";
    this.setInStorage("deliveryMethod","");
  }



 pocztaPolska.show({});



} 


showTrue() {
  console.log(this.checkboxCheckedPocztaPolska)
  console.log(this.selectedPointPoczta)
}

 // Zapisz dane w localStorage
saveFormDataToStorage() {
    this.setInStorage('formData', JSON.stringify(this.formData));
    this.setInStorage('wantInvoice', JSON.stringify(this.wantInvoice));
    this.setInStorage('invoiceType', this.invoiceType);
}

    // Załaduj dane z localStorage (jeśli są)
loadFormDataFromStorage() {
    const savedFormData = this.getFromStorage('formData');
    if (savedFormData) {
      this.formData = JSON.parse(savedFormData);
    }

    const savedWantInvoice = this.getFromStorage('wantInvoice');
    if (savedWantInvoice) {
      this.wantInvoice = JSON.parse(savedWantInvoice);
    }

    const savedInvoiceType = this.getFromStorage('invoiceType');
    if (savedInvoiceType) {
      this.invoiceType = savedInvoiceType;
    }
}



checkboxInpostKurier: boolean = false;
checkboxDHLKurier: boolean = false;
checkboxPocztexKurier: boolean = false;


choseKurierInpost() {
  
  this.checkboxCheckedPocztaPolska = false;
  this.checkboxChecked = false;
  this.checkboxDHLKurier = false;
  this.checkboxPocztexKurier = false;
  this.inpostPaczka = false;
  this.pocztaPolska = false;

  if (this.checkboxInpostKurier) {
         this.deliveryMethod = "INPOST_KURIER";
         this.dostawZostalaWybrana(true);



          if ( this.calculatedBasketPriceNumber() >= 79.99 ) {
       
          this.kosztDostawy = 0.0;
          this.setInStorage("kosztDostawy", "0.0");
        
        } else {
        
          this.kosztDostawy = 11.99;
          this.setInStorage("kosztDostawy", "11.99");
      
        }
      



  } else {
    this.deliveryMethod = "";
    this.setInStorage("deliveryMethod","");
  
    this.kosztDostawy = 0;
         this.setInStorage("kosztDostawy", "0");

  }

}

choseKurierPocztex() {


  this.checkboxInpostKurier = false;
    this.checkboxCheckedPocztaPolska = false;
  this.checkboxChecked = false;
  this.checkboxDHLKurier = false;
this.inpostPaczka = false;
  this.pocztaPolska = false;

   if (this.checkboxPocztexKurier) {
         this.deliveryMethod = "POCZTEX_KURIER";
        this.dostawZostalaWybrana(true);
     


           if ( this.calculatedBasketPriceNumber() >= 79.99 ) {
       
          this.kosztDostawy = 0.0;
          this.setInStorage("kosztDostawy", "0.0");
        
        } else {
        
          this.kosztDostawy = 9.99;
          this.setInStorage("kosztDostawy", "9.99");
      
        }
      
        


  }else {

     this.kosztDostawy = 0;
         this.setInStorage("kosztDostawy", "0");
    this.deliveryMethod = "";
    this.setInStorage("deliveryMethod","");
  }


}





choseKurierDHL() {
    this.checkboxPocztexKurier = false;
  this.checkboxInpostKurier = false;
    this.checkboxCheckedPocztaPolska = false;
  this.checkboxChecked = false;
  this.inpostPaczka = false;
  this.pocztaPolska = false;

   if (this.checkboxDHLKurier) {
         this.deliveryMethod = "DHL_KURIER";
         this.dostawZostalaWybrana(true);

            if ( this.calculatedBasketPriceNumber() >= 79.99 ) {
       
          this.kosztDostawy = 0.0;
          this.setInStorage("kosztDostawy", "0.0");
        
        } else {
        
          this.kosztDostawy = 12.99;
          this.setInStorage("kosztDostawy", "12.99");
      
        }
      

  } else {

    this.kosztDostawy = 0;
         this.setInStorage("kosztDostawy", "0");
    this.deliveryMethod = "";
    this.setInStorage("deliveryMethod","");
  }



}


isValidEmail(email: string | null | undefined): boolean {
  if (!email) return false;  // jeśli email jest null, undefined lub pusty string, zwróć false
  return email.includes('@');
}






  pocztaPolska: boolean = false;

  inpostPaczka: boolean = false;


selectedPaczkomat: any = null;






}
