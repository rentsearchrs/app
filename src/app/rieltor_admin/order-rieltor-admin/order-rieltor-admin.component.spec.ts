import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderRieltorAdminComponent } from './order-rieltor-admin.component';

describe('OrderRieltorAdminComponent', () => {
  let component: OrderRieltorAdminComponent;
  let fixture: ComponentFixture<OrderRieltorAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrderRieltorAdminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrderRieltorAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
