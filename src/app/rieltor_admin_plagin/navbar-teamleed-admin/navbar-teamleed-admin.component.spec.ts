import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarTeamleedAdminComponent } from './navbar-teamleed-admin.component';

describe('NavbarTeamleedAdminComponent', () => {
  let component: NavbarTeamleedAdminComponent;
  let fixture: ComponentFixture<NavbarTeamleedAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NavbarTeamleedAdminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NavbarTeamleedAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
