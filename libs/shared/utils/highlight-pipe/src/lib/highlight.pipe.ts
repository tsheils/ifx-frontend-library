import { inject, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'highlight',
  standalone: true,
})
export class HighlightPipe implements PipeTransform {
  readonly sanitizer: DomSanitizer = inject(DomSanitizer);

  transform(text: string, search: unknown): SafeHtml | string {
    if (search && text && typeof search == 'string') {
      let pattern = search.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&');
      pattern = pattern
        .split(' ')
        .filter((t) => {
          return t.length > 0;
        })
        .join('|');
      const regex = new RegExp(pattern, 'gi');

      return this.sanitizer.bypassSecurityTrustHtml(
        text.replace(
          regex,
          (match) =>
            `<span style="font-weight:900;" class="search-highlight">${match}</span>`
        )
      );
    } else {
      return text;
    }
  }
}
