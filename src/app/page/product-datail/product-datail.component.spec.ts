import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDatailComponent } from './product-datail.component';

describe('ProductDatailComponent', () => {
  let component: ProductDatailComponent;
  let fixture: ComponentFixture<ProductDatailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductDatailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductDatailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
