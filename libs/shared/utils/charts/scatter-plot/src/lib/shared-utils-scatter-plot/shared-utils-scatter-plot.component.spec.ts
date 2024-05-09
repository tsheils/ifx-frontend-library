import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedUtilsScatterPlotComponent } from './shared-utils-scatter-plot.component';

describe('SharedUtilsScatterPlotComponent', () => {
  let component: SharedUtilsScatterPlotComponent;
  let fixture: ComponentFixture<SharedUtilsScatterPlotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedUtilsScatterPlotComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedUtilsScatterPlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
