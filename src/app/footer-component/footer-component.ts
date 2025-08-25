import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer-component',
  imports: [RouterModule],
  templateUrl: './footer-component.html',
  styleUrl: './footer-component.css'
})
export class FooterComponent {




  

  constructor(private router: Router) {}


  scrollToTop(event:string): void {
    console.log(this.router.url + " " +  event)


    if (this.router.url != event)  {
      
        window.scrollTo({
          top: 0,
          behavior: 'auto' // Dodaje płynne przewijanie
        });

    }
  }



}
