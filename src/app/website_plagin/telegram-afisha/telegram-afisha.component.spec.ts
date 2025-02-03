import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TelegramAfishaComponent } from './telegram-afisha.component';

describe('TelegramAfishaComponent', () => {
  let component: TelegramAfishaComponent;
  let fixture: ComponentFixture<TelegramAfishaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TelegramAfishaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TelegramAfishaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
