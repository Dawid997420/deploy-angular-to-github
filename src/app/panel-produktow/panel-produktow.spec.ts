import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelProduktow } from './panel-produktow';

describe('PanelProduktow', () => {
  let component: PanelProduktow;
  let fixture: ComponentFixture<PanelProduktow>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PanelProduktow]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PanelProduktow);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
