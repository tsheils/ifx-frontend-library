import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { StoreModule } from "@ngrx/store";
import { IFX_TOOLS_FEATURE_KEY, ifxToolsReducer } from "ifx-tool-store";
import { ScaffoldHopperComponent } from './scaffold-hopper.component';

describe('ScaffoldHopperComponent', () => {
  let component: ScaffoldHopperComponent;
  let fixture: ComponentFixture<ScaffoldHopperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ScaffoldHopperComponent,
        NoopAnimationsModule,
        StoreModule.forRoot({}),
        StoreModule.forFeature(IFX_TOOLS_FEATURE_KEY, ifxToolsReducer),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ScaffoldHopperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
