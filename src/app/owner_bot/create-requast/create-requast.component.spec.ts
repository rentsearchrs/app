import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRequastComponent } from './create-requast.component';

describe('CreateRequastComponent', () => {
  let component: CreateRequastComponent;
  let fixture: ComponentFixture<CreateRequastComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateRequastComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateRequastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
