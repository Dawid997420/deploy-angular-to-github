import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupBasketComponent } from './popup-basket-component';

describe('PopupBasketComponent', () => {
  let component: PopupBasketComponent;
  let fixture: ComponentFixture<PopupBasketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopupBasketComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopupBasketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
