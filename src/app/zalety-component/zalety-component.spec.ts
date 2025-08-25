import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZaletyComponent } from './zalety-component';

describe('ZaletyComponent', () => {
  let component: ZaletyComponent;
  let fixture: ComponentFixture<ZaletyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZaletyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZaletyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
