import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { ExternalLinkComponent } from 'external-link';

@Component({
  selector: 'lib-footer-template',
  imports: [CommonModule, ExternalLinkComponent, MatListModule],
  templateUrl: './footer-template.component.html',
  styleUrls: ['./footer-template.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterTemplateComponent {}
