import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedUtilsSelectedFilterListComponent } from './shared-utils-selected-filter-list.component';

describe('SharedUtilsSelectedFilterListComponent', () => {
  let component: SharedUtilsSelectedFilterListComponent;
  let fixture: ComponentFixture<SharedUtilsSelectedFilterListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedUtilsSelectedFilterListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedUtilsSelectedFilterListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
