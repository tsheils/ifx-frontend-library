import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { StoreModule } from "@ngrx/store";
import { IFX_TOOLS_FEATURE_KEY, ifxToolsReducer } from "ifx-tool-store";
import { ToolBrowseComponent } from './tool-browse.component';

describe('ToolBrowseComponent', () => {
  let component: ToolBrowseComponent;
  let fixture: ComponentFixture<ToolBrowseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ToolBrowseComponent,
      NoopAnimationsModule,
      StoreModule.forRoot({}),
      StoreModule.forFeature(IFX_TOOLS_FEATURE_KEY, ifxToolsReducer),
    ],
    }).compileComponents();

    fixture = TestBed.createComponent(ToolBrowseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
