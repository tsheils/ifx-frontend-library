import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RampMainComponent } from './ramp-main.component';

describe('RampMainComponent', () => {
  let component: RampMainComponent;
  let fixture: ComponentFixture<RampMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RampMainComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RampMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
