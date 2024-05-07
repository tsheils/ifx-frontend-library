import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FilterDownloadButtonComponent } from './filter-download-button.component';

describe('FilterDownloadButtonComponent', () => {
  let component: FilterDownloadButtonComponent;
  let fixture: ComponentFixture<FilterDownloadButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterDownloadButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FilterDownloadButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
