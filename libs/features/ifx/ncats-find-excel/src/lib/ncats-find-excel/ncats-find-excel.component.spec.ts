import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NcatsFindExcelComponent } from './ncats-find-excel.component';

describe('NcatsFindExcelComponent', () => {
  let component: NcatsFindExcelComponent;
  let fixture: ComponentFixture<NcatsFindExcelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NcatsFindExcelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NcatsFindExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
