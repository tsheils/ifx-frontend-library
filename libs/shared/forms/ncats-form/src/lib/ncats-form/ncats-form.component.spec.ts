import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NcatsFormComponent } from './ncats-form.component';

describe('NcatsFormComponent', () => {
  let component: NcatsFormComponent;
  let fixture: ComponentFixture<NcatsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NcatsFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NcatsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
