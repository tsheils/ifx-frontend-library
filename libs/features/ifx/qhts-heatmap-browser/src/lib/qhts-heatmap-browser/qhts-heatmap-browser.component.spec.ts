import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { StoreModule } from "@ngrx/store";
import { IFX_TOOLS_FEATURE_KEY, ifxToolsReducer } from "ifx-tool-store";
import { QhtsHeatmapBrowserComponent } from './qhts-heatmap-browser.component';

describe('QhtsHeatmapBrowserComponent', () => {
  let component: QhtsHeatmapBrowserComponent;
  let fixture: ComponentFixture<QhtsHeatmapBrowserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        QhtsHeatmapBrowserComponent,
        NoopAnimationsModule,
        StoreModule.forRoot({}),
        StoreModule.forFeature(IFX_TOOLS_FEATURE_KEY, ifxToolsReducer)
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(QhtsHeatmapBrowserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
