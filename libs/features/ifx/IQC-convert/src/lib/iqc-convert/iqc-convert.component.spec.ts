import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { StoreModule } from "@ngrx/store";
import { IFX_TOOLS_FEATURE_KEY, ifxToolsReducer } from "ifx-tool-store";
import { IqcConvertComponent } from './iqc-convert.component';

describe('IqcConvertComponent', () => {
  let component: IqcConvertComponent;
  let fixture: ComponentFixture<IqcConvertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        IqcConvertComponent,
        NoopAnimationsModule,
        StoreModule.forRoot({}),
        StoreModule.forFeature(IFX_TOOLS_FEATURE_KEY, ifxToolsReducer),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(IqcConvertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
