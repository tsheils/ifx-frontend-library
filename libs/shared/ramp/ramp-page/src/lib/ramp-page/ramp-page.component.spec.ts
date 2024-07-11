import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RampPageComponent } from './ramp-page.component';

describe('RampPageComponent', () => {
  let component: RampPageComponent;
  let fixture: ComponentFixture<RampPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RampPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RampPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
