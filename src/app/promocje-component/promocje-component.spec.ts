import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromocjeComponent } from './promocje-component';

describe('PromocjeComponent', () => {
  let component: PromocjeComponent;
  let fixture: ComponentFixture<PromocjeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromocjeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PromocjeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
