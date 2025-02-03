import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChanelControlComponent } from './chanel-control.component';

describe('ChanelControlComponent', () => {
  let component: ChanelControlComponent;
  let fixture: ComponentFixture<ChanelControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChanelControlComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChanelControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
