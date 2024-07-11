import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { IFX_TOOLS_FEATURE_KEY, ifxToolsReducer } from 'ifx-tool-store';
import { DefaultToolComponent } from './default-tool.component';

describe('DefaultToolComponent', () => {
  let component: DefaultToolComponent;
  let fixture: ComponentFixture<DefaultToolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DefaultToolComponent,
        NoopAnimationsModule,
        StoreModule.forRoot({}),
        StoreModule.forFeature(IFX_TOOLS_FEATURE_KEY, ifxToolsReducer),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DefaultToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
