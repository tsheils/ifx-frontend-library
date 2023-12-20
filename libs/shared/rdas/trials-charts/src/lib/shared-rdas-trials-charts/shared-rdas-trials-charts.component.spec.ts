import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedRdasTrialsChartsComponent } from './shared-rdas-trials-charts.component';

describe('SharedRdasTrialsChartsComponent', () => {
  let component: SharedRdasTrialsChartsComponent;
  let fixture: ComponentFixture<SharedRdasTrialsChartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedRdasTrialsChartsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedRdasTrialsChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
