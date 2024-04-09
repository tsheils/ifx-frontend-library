import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QhtsHeatmapBrowserComponent } from './qhts-heatmap-browser.component';

describe('QhtsHeatmapBrowserComponent', () => {
  let component: QhtsHeatmapBrowserComponent;
  let fixture: ComponentFixture<QhtsHeatmapBrowserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QhtsHeatmapBrowserComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(QhtsHeatmapBrowserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
