import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { StoreModule } from "@ngrx/store";
import { IFX_TOOLS_FEATURE_KEY, ifxToolsReducer } from "ifx-tool-store";
import { QhtsDataBrowserComponent } from './qhts-data-browser.component';

describe('QhtsDataBrowserComponent', () => {
  let component: QhtsDataBrowserComponent;
  let fixture: ComponentFixture<QhtsDataBrowserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        QhtsDataBrowserComponent,
        NoopAnimationsModule,
        StoreModule.forRoot({}),
        StoreModule.forFeature(IFX_TOOLS_FEATURE_KEY, ifxToolsReducer)
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(QhtsDataBrowserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
