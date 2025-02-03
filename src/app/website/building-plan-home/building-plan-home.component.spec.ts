import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildingPlanHomeComponent } from './building-plan-home.component';

describe('BuildingPlanHomeComponent', () => {
  let component: BuildingPlanHomeComponent;
  let fixture: ComponentFixture<BuildingPlanHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BuildingPlanHomeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BuildingPlanHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
