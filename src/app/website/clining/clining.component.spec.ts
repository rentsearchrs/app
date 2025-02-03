import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CliningComponent } from './clining.component';

describe('CliningComponent', () => {
  let component: CliningComponent;
  let fixture: ComponentFixture<CliningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CliningComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CliningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
