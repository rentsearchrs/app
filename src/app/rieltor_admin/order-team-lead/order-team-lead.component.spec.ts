import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderTeamLeadComponent } from './order-team-lead.component';

describe('OrderTeamLeadComponent', () => {
  let component: OrderTeamLeadComponent;
  let fixture: ComponentFixture<OrderTeamLeadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrderTeamLeadComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrderTeamLeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
