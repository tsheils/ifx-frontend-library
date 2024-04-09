import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScaffoldHopperComponent } from './scaffold-hopper.component';

describe('ScaffoldHopperComponent', () => {
  let component: ScaffoldHopperComponent;
  let fixture: ComponentFixture<ScaffoldHopperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScaffoldHopperComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ScaffoldHopperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
