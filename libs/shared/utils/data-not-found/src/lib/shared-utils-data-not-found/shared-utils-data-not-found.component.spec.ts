import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedUtilsDataNotFoundComponent } from './shared-utils-data-not-found.component';

describe('SharedUtilsDataNotFoundComponent', () => {
  let component: SharedUtilsDataNotFoundComponent;
  let fixture: ComponentFixture<SharedUtilsDataNotFoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedUtilsDataNotFoundComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedUtilsDataNotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
