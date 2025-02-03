import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticTeamLeadComponent } from './statistic-team-lead.component';

describe('StatisticTeamLeadComponent', () => {
  let component: StatisticTeamLeadComponent;
  let fixture: ComponentFixture<StatisticTeamLeadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StatisticTeamLeadComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StatisticTeamLeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
