import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwiperPersonComponent } from './swiper-person.component';

describe('SwiperPersonComponent', () => {
  let component: SwiperPersonComponent;
  let fixture: ComponentFixture<SwiperPersonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SwiperPersonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SwiperPersonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
