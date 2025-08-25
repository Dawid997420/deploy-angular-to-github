import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DodajProdukt2 } from './dodaj-produkt2';

describe('DodajProdukt2', () => {
  let component: DodajProdukt2;
  let fixture: ComponentFixture<DodajProdukt2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DodajProdukt2]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DodajProdukt2);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
