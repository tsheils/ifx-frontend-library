import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { StoreModule } from "@ngrx/store";
import { IFX_TOOLS_FEATURE_KEY, ifxToolsReducer } from "ifx-tool-store";
import { QhtsPlateBrowserComponent } from './qhts-plate-browser.component';

describe('QhtsPlateBrowserComponent', () => {
  let component: QhtsPlateBrowserComponent;
  let fixture: ComponentFixture<QhtsPlateBrowserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        QhtsPlateBrowserComponent,
        NoopAnimationsModule,
        StoreModule.forRoot({}),
        StoreModule.forFeature(IFX_TOOLS_FEATURE_KEY, ifxToolsReducer)
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(QhtsPlateBrowserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
