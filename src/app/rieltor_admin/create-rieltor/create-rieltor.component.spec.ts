import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRieltorComponent } from './create-rieltor.component';

describe('CreateRieltorComponent', () => {
  let component: CreateRieltorComponent;
  let fixture: ComponentFixture<CreateRieltorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateRieltorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateRieltorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
