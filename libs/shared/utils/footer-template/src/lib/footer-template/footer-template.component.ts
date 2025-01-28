import { CommonModule } from '@angular/common'
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core'
import { MatListModule } from '@angular/material/list'
import { ExternalLinkComponent } from '@ncats-frontend-library/shared/utils/external-link'

@Component({
  selector: 'ncats-frontend-library-footer-template',
  imports: [CommonModule, ExternalLinkComponent, MatListModule],
  templateUrl: './footer-template.component.html',
  styleUrls: ['./footer-template.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterTemplateComponent {}
