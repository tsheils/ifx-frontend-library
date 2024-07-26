import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { IFX_TOOLS_FEATURE_KEY, ifxToolsReducer } from 'ifx-tool-store';
import { QhtsSampleClientComponent } from './qhts-sample-client.component';

describe('QhtsSampleClientComponent', () => {
  let component: QhtsSampleClientComponent;
  let fixture: ComponentFixture<QhtsSampleClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        QhtsSampleClientComponent,
        NoopAnimationsModule,
        StoreModule.forRoot({}),
        StoreModule.forFeature(IFX_TOOLS_FEATURE_KEY, ifxToolsReducer),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(QhtsSampleClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
