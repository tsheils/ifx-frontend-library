import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { RAMP_STORE_FEATURE_KEY, rampReducer } from 'ramp-store';
import { ChemicalDescriptorsPageComponent } from './chemical-descriptors-page.component';

describe('ChemicalDescriptorsPageComponent', () => {
  let component: ChemicalDescriptorsPageComponent;
  let fixture: ComponentFixture<ChemicalDescriptorsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ChemicalDescriptorsPageComponent,
        NoopAnimationsModule,
        StoreModule.forRoot({}),
        StoreModule.forFeature(RAMP_STORE_FEATURE_KEY, rampReducer),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ChemicalDescriptorsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
