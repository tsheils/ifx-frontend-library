import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScreenshotDisplayComponent } from './screenshot-display.component';

describe('ScreenshotDisplayComponent', () => {
  let component: ScreenshotDisplayComponent;
  let fixture: ComponentFixture<ScreenshotDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScreenshotDisplayComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ScreenshotDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
