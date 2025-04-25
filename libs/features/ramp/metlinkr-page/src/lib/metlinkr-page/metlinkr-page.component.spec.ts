import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MetlinkrPageComponent } from './metlinkr-page.component';

describe('MetlinkrPageComponent', () => {
  let component: MetlinkrPageComponent;
  let fixture: ComponentFixture<MetlinkrPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MetlinkrPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MetlinkrPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
