import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  viewChild,
} from '@angular/core'
import { CommonModule, NgOptimizedImage } from '@angular/common'
import { MatAnchor } from '@angular/material/button'
import { MatCard } from '@angular/material/card'
import { MatRipple } from '@angular/material/core'
import { MatIcon } from '@angular/material/icon'
import { RouterLink } from '@angular/router'

@Component({
  selector: 'lib-ramp-home',
  imports: [
    CommonModule,
    MatRipple,
    RouterLink,
    MatCard,
    MatIcon,
    NgOptimizedImage,
    MatAnchor,
  ],
  templateUrl: './ramp-home.component.html',
  styleUrl: './ramp-home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class RampHomeComponent {
  elemRef = viewChild<ElementRef>('details')

  goToDetails(): void {
    this.elemRef()?.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
    })
  }
}
