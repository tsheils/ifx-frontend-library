import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeaturesRdasRdasAboutComponent } from './features-rdas-rdas-about.component';

describe('FeaturesRdasRdasAboutComponent', () => {
  let component: FeaturesRdasRdasAboutComponent;
  let fixture: ComponentFixture<FeaturesRdasRdasAboutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeaturesRdasRdasAboutComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FeaturesRdasRdasAboutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
