import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Sprzedawca } from './sprzedawca';

describe('Sprzedawca', () => {
  let component: Sprzedawca;
  let fixture: ComponentFixture<Sprzedawca>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Sprzedawca]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Sprzedawca);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
