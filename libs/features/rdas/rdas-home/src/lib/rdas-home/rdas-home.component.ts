import { CdkScrollable } from '@angular/cdk/overlay'
import { CdkScrollableModule, ScrollingModule } from '@angular/cdk/scrolling'
import { NgOptimizedImage } from '@angular/common'
import {
  Component,
  ElementRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core'
import { MatAnchor } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatIconModule } from '@angular/material/icon'
import { LoadingSpinnerComponent } from '@ncats-frontend-library/shared/utils/loading-spinner'

@Component({
  selector: 'rdas-home',
  templateUrl: './rdas-home.component.html',
  styleUrls: ['./rdas-home.component.scss'],
  imports: [
    MatIconModule,
    MatCardModule,
    ScrollingModule,
    CdkScrollableModule,
    NgOptimizedImage,
    LoadingSpinnerComponent,
    MatAnchor,
  ],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
})
export class RdasHomeComponent {
  @ViewChild(CdkScrollable, { static: false }) scrollable!: CdkScrollable

  @ViewChild('details', { read: ElementRef, static: true })
  elemRef!: ElementRef
  data!: unknown

  goToDetails(): void {
    this.elemRef.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
    })
  }
}
