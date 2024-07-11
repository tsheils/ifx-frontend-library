import { HttpClient, provideHttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { IFX_TOOLS_FEATURE_KEY, ifxToolsReducer } from 'ifx-tool-store';
import { provideMarkdown } from 'ngx-markdown';
import { ChemkitComponent } from './chemkit.component';

describe('ChemkitComponent', () => {
  let component: ChemkitComponent;
  let fixture: ComponentFixture<ChemkitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ChemkitComponent,
        NoopAnimationsModule,
        HttpClientTestingModule,
        StoreModule.forRoot({}),
        StoreModule.forFeature(IFX_TOOLS_FEATURE_KEY, ifxToolsReducer),
      ],
      providers: [
        HttpClientTestingModule,
        provideMarkdown({ loader: HttpClient }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ChemkitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
