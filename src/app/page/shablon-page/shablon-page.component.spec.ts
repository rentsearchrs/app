import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShablonPageComponent } from './shablon-page.component';

describe('ShablonPageComponent', () => {
  let component: ShablonPageComponent;
  let fixture: ComponentFixture<ShablonPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShablonPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShablonPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
