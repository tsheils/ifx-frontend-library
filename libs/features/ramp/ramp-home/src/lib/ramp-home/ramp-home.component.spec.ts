import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RampHomeComponent } from './ramp-home.component';

describe('RampHomeComponent', () => {
  let component: RampHomeComponent;
  let fixture: ComponentFixture<RampHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RampHomeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RampHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
