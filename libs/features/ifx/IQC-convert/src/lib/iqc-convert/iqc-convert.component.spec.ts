import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IqcConvertComponent } from './iqc-convert.component';

describe('IqcConvertComponent', () => {
  let component: IqcConvertComponent;
  let fixture: ComponentFixture<IqcConvertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IqcConvertComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IqcConvertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
