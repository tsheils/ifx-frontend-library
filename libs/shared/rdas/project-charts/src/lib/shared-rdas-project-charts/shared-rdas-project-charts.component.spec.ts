import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedRdasProjectChartsComponent } from './shared-rdas-project-charts.component';

describe('SharedRdasProjectChartsComponent', () => {
  let component: SharedRdasProjectChartsComponent;
  let fixture: ComponentFixture<SharedRdasProjectChartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedRdasProjectChartsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedRdasProjectChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
