import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SafeHtmlPipe } from './safe-html-pipe';

describe('SafeHtmlPipe', () => {
  let component: SafeHtmlPipe;
  let fixture: ComponentFixture<SafeHtmlPipe>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SafeHtmlPipe],
    }).compileComponents();

    fixture = TestBed.createComponent(SafeHtmlPipe);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
