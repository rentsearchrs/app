import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainPageWebsiteComponent } from './main-page-website.component';

describe('MainPageWebsiteComponent', () => {
  let component: MainPageWebsiteComponent;
  let fixture: ComponentFixture<MainPageWebsiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MainPageWebsiteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MainPageWebsiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
