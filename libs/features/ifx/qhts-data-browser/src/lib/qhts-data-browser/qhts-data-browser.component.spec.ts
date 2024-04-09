import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QhtsDataBrowserComponent } from './qhts-data-browser.component';

describe('QhtsDataBrowserComponent', () => {
  let component: QhtsDataBrowserComponent;
  let fixture: ComponentFixture<QhtsDataBrowserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QhtsDataBrowserComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(QhtsDataBrowserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
