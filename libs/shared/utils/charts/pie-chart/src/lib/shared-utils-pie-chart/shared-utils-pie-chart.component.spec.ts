import { ComponentRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PIEFILTERS } from '../../test-setup';
import { SharedUtilsPieChartComponent } from './shared-utils-pie-chart.component';

describe('SharedUtilsPieChartComponent', () => {
  let component: SharedUtilsPieChartComponent;
  let fixture: ComponentFixture<SharedUtilsPieChartComponent>;
  let componentRef: ComponentRef<SharedUtilsPieChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedUtilsPieChartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedUtilsPieChartComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    componentRef.setInput('dataSignal', PIEFILTERS);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
