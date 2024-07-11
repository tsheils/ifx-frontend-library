import { HttpClient, provideHttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMarkdown } from 'ngx-markdown';
import { MarkdownViewerComponent } from './markdown-viewer.component';

describe('MarkdownViewerComponent', () => {
  let component: MarkdownViewerComponent;
  let fixture: ComponentFixture<MarkdownViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarkdownViewerComponent],
      providers: [
        HttpClientTestingModule,
        provideHttpClient(),
        provideMarkdown({ loader: HttpClient }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MarkdownViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
