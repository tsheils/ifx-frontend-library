import { ChangeDetectionStrategy, Component, input } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MarkdownComponent } from 'ngx-markdown'

@Component({
  selector: 'lib-markdown-viewer',
  standalone: true,
  imports: [CommonModule, MarkdownComponent],
  templateUrl: './markdown-viewer.component.html',
  styleUrl: './markdown-viewer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MarkdownViewerComponent {
  mkdwnString = input<string>()
}
