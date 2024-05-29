import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HistoryApiComponent } from './history-api.component';

describe('HistoryApiComponent', () => {
  let component: HistoryApiComponent;
  let fixture: ComponentFixture<HistoryApiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoryApiComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HistoryApiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
