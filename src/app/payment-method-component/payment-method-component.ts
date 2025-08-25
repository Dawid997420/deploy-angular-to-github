import { Component } from '@angular/core';

@Component({
  selector: 'app-payment-method-component',
  imports: [],
  templateUrl: './payment-method-component.html',
  styleUrl: './payment-method-component.css'
})
export class PaymentMethodComponent {


  
  selectedPaymentMethod: string | null = null;

  selectPaymentMethod(method: string): void {
    if (this.selectedPaymentMethod === method) {
      // Jeśli kliknięto już zaznaczone – odznacz
      this.selectedPaymentMethod = null;
      localStorage.setItem("paymentMethod", "")

    } else {
      
      this.selectedPaymentMethod = method;
      localStorage.setItem("paymentMethod", this.selectedPaymentMethod )
    }
  }
  
}
