import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RampCorePageComponent } from './ramp-core-page.component';

describe('RampCorePageComponent', () => {
  let component: RampCorePageComponent;
  let fixture: ComponentFixture<RampCorePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RampCorePageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RampCorePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
