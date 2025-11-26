import { Component, computed, input, resource } from '@angular/core';
import { xml, zoom } from 'd3';
import { select } from 'd3-selection';
import { GenericChartComponent } from 'generic-chart';
import { ImageDownloadComponent } from 'image-download';

@Component({
  selector: 'lib-image-from-file',
  imports: [
    ImageDownloadComponent
  ],
  templateUrl: 'image-from-file.html',
  styleUrl: './image-from-file.scss',
})
export class ImageFromFile extends GenericChartComponent {
   dataUrl = input<string>()

  override svgExport = computed(()=> {
    if(this.dataFileResource.hasValue()) {
      return <unknown>this.dataFileResource.value() as SVGElement
    } else {
      return undefined as unknown as SVGElement
    }
    }
  );

  dataFileResource = resource({
    params: () => ({dataUrl: <string>this.dataUrl()}),
    loader:({params}) => {
      return xml(params.dataUrl).then(res => {
        return res.documentElement
      })
    }
  })



  override svg = computed(()=> {
    if(this.dataFileResource.hasValue()) {
      const element = select(this.chartElement().nativeElement)
      const node = element.node()
      node!.append(this.dataFileResource.value())
      element?.call(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        zoom()
          .scaleExtent([1, 8])
          .on('zoom', (event) => {
            const holder = select('.svglite');
            holder.attr('transform', event.transform);
          })
      );
      return node
    } else return undefined
  })

  constructor() {
    super();
    this.margins.set({ top: 20, bottom: 50, right: 30, left: 10 });
  }
}

