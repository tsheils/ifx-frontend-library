import { ComponentFixture, TestBed } from '@angular/core/testing'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'

import { LoadingSpinnerComponent } from './loading-spinner.component'

describe('LoadingSpinnerComponent', () => {
  let component: LoadingSpinnerComponent
  let fixture: ComponentFixture<LoadingSpinnerComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        MatProgressSpinnerModule,
        LoadingSpinnerComponent,
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(LoadingSpinnerComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
