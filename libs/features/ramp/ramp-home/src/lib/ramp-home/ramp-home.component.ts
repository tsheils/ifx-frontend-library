import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  viewChild,
} from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { MatAnchor, MatButton } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatRipple } from '@angular/material/core';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { RampSelectors } from 'ramp-store';

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
    MatButton,
  ],
  templateUrl: './ramp-home.component.html',
  styleUrl: './ramp-home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class RampHomeComponent {
  private readonly store = inject(Store);
  elemRef = viewChild<ElementRef>('details');
  api = this.store.selectSignal(RampSelectors.getRampApi);
  entityCounts = computed(
    () => this.store.selectSignal(RampSelectors.getAllRamp)().entityCounts
  );

  goToDetails(): void {
    this.elemRef()?.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
    });
  }

  cleanLabel(label: string): string {
    return label.replace(/-/g, ' ');
  }

  _originalOrder = () => 0;
}
