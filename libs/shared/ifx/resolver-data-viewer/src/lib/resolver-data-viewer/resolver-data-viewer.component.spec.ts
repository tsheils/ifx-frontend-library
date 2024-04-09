import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResolverDataViewerComponent } from './resolver-data-viewer.component';

describe('ResolverDataViewerComponent', () => {
  let component: ResolverDataViewerComponent;
  let fixture: ComponentFixture<ResolverDataViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResolverDataViewerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ResolverDataViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
