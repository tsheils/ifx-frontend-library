import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { FilterCategory } from '@ncats-frontend-library/models/utils';
import { SharedUtilsFilterPanelComponent } from './shared-utils-filter-panel.component';

describe('SharedUtilsFilterPanelComponent', () => {
  let component: SharedUtilsFilterPanelComponent;
  let fixture: ComponentFixture<SharedUtilsFilterPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        SharedUtilsFilterPanelComponent
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedUtilsFilterPanelComponent);
    component = fixture.componentInstance;
    component.filter = new FilterCategory({
      label: 'fff',
      query: 'ffff',
      values: [],
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
