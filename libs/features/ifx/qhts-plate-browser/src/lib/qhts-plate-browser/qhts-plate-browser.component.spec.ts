import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QhtsPlateBrowserComponent } from './qhts-plate-browser.component';

describe('QhtsPlateBrowserComponent', () => {
  let component: QhtsPlateBrowserComponent;
  let fixture: ComponentFixture<QhtsPlateBrowserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QhtsPlateBrowserComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(QhtsPlateBrowserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
