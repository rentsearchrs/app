import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarRieltorAdminComponent } from './navbar-rieltor-admin.component';

describe('NavbarRieltorAdminComponent', () => {
  let component: NavbarRieltorAdminComponent;
  let fixture: ComponentFixture<NavbarRieltorAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NavbarRieltorAdminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NavbarRieltorAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
