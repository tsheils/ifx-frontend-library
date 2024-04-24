import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { StoreModule } from "@ngrx/store";
import { IFX_TOOLS_FEATURE_KEY, ifxToolsReducer } from "ifx-tool-store";
import { NcatsFindExcelComponent } from './ncats-find-excel.component';

describe('NcatsFindExcelComponent', () => {
  let component: NcatsFindExcelComponent;
  let fixture: ComponentFixture<NcatsFindExcelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NcatsFindExcelComponent,
        NoopAnimationsModule,
        StoreModule.forRoot({}),
        StoreModule.forFeature(IFX_TOOLS_FEATURE_KEY, ifxToolsReducer)
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NcatsFindExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
