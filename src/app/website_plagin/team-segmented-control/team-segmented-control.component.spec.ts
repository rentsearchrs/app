import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamSegmentedControlComponent } from './team-segmented-control.component';

describe('TeamSegmentedControlComponent', () => {
  let component: TeamSegmentedControlComponent;
  let fixture: ComponentFixture<TeamSegmentedControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TeamSegmentedControlComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TeamSegmentedControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
