import { CommonModule, DOCUMENT } from '@angular/common'
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatMenuModule } from '@angular/material/menu'
import { Filter, FilterCategory } from '@ncats-frontend-library/models/utils'
import { GenericChartComponent } from 'generic-chart'

@Component({
  selector: 'lib-image-download',
  imports: [CommonModule, MatButtonModule, MatMenuModule, MatIconModule],
  templateUrl: './image-download.component.html',
  styleUrl: './image-download.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageDownloadComponent {
  chartComponent = input<GenericChartComponent>()
  svg = input<SVGElement>({} as SVGElement)
  showTSV = input(true)
  dom = inject(DOCUMENT)

  downloadSVG() {
    let svgString
    if (this.svg()) {
      svgString = this.getSVGString(this.svg())
    } else {
      svgString = this.getSVGString(
        <SVGElement>this.chartComponent()?.svgExport()
      )
    }
    this._downloadFile(this._makeBlob(svgString, 'image/svg+xml'), 'data.svg')
  }

  downloadPNG() {
    let svgString
    if (this.svg()) {
      svgString = this.getSVGString(this.svg())
    } else {
      svgString = this.getSVGString(
        <SVGElement>this.chartComponent()?.svgExport()
      )
    }
    this.svgString2Image(svgString) // passes Blob and filesize String to the callback
  }

  downloadTSV() {
    const data = this.chartComponent()?.dataSignal() as FilterCategory
    if (data) {
      this._downloadFile(
        this._makeBlob(this._toTSV(data)),
        `${data.label.replaceAll(' ', '-').toLocaleLowerCase()}.tsv`
      )
    }
  }

  // Below are the functions that handle actual exporting:
  getSVGString(svgNode: SVGElement) {
    const cssStyleText = this.getCSSStyles(svgNode)
    this.appendCSS(cssStyleText, svgNode)
    const serializer = new XMLSerializer()
    return serializer.serializeToString(svgNode)
  }

  getCSSStyles(parentElement: SVGElement) {
    const selectorTextArr = []
    // Add Parent element Id and Classes to the list
    selectorTextArr.push('#' + parentElement.id)
    for (let c = 0; c < parentElement.classList.length; c++)
      if (!this.contains('.' + parentElement.classList[c], selectorTextArr))
        selectorTextArr.push('.' + parentElement.classList[c])

    // Add Children element Ids and Classes to the list
    const nodes = parentElement.getElementsByTagName('*')
    for (let i = 0; i < nodes.length; i++) {
      const id = nodes[i].id
      if (!this.contains('#' + id, selectorTextArr))
        selectorTextArr.push('#' + id)

      const classes = nodes[i].classList
      for (let c = 0; c < classes.length; c++)
        if (!this.contains('.' + classes[c], selectorTextArr))
          selectorTextArr.push('.' + classes[c])
    }

    // Extract CSS Rules
    let extractedCSSText = ''
    for (let i = 0; i < this.dom.styleSheets.length; i++) {
      const s = this.dom.styleSheets[i]
      try {
        if (!s.cssRules) continue
      } catch (e: unknown) {
        // if(<unknown>e['name'] !== 'SecurityError') throw e; // for Firefox
        continue
      }
      const cssRules: CSSRuleList = s.cssRules
      for (let r = 0; r < cssRules.length; r++) {
        const rule: CSSStyleRule = cssRules[r] as CSSStyleRule
        if (this.contains(rule.selectorText, selectorTextArr))
          extractedCSSText += rule.cssText
      }
    }
    return extractedCSSText
  }

  contains(str: string, arr: string[]) {
    return arr.indexOf(str) !== -1
  }

  appendCSS(cssText: string, element: SVGElement) {
    const styleElement = document.createElement('style')
    styleElement.setAttribute('type', 'text/css')
    styleElement.innerHTML = cssText
    const refNode = element.hasChildNodes() ? element.children[0] : null
    element.insertBefore(styleElement, refNode)
  }

  svgString2Image(svgString = '', width = 1000, height = 1000) {
    const imgsrc =
      'data:image/svg+xml;base64,' +
      btoa(unescape(encodeURIComponent(svgString))) // Convert SVG string to data URL
    const canvas = this.dom.createElement('canvas')
    const context = canvas.getContext('2d')
    if (context) {
      canvas.width = width
      canvas.height = height

      const image = new Image()

      image.onload = () => {
        context.clearRect(0, 0, width, height)
        context.drawImage(image, 0, 0, width, height)
        canvas.toBlob((blob) => {
          this._downloadFile(blob as Blob, 'image.png')
        })
      }
      image.src = imgsrc
    }
  }

  _makeBlob(data: string, type = 'text/tsv') {
    return new Blob([data], { type: type })
  }

  _toTSV(category: FilterCategory | undefined): string {
    if (category && category.values) {
      const data = category.values
      //   grab the column headings (separated by tabs)
      const headings: string = Object.keys(data[0] as Filter).join('\t')
      // iterate over the data
      const rows: string[] = <string[]>data.reduce(
        (acc: string[], c: Filter) => {
          // for each row object get its values and add tabs between them
          // then add them as a new array to the outgoing array
          return acc.concat([Object.values(c).join('\t')])

          // finally joining each row with a line break
        },
        [headings]
      )
      return rows.join('\n')
    } else return ''
  }

  _downloadFile(data: Blob, name: string) {
    if (this.dom) {
      const link = this.dom.createElement('a')
      if (link.download !== undefined) {
        // feature detection
        // Browsers that support HTML5 download attribute
        const url = URL.createObjectURL(data)
        link.setAttribute('href', url)
        link.setAttribute('download', `${name}`)
        link.style.visibility = 'hidden'
        this.dom.body.appendChild(link)
        link.click()
        this.dom.body.removeChild(link)
      }
    }
  }
}
