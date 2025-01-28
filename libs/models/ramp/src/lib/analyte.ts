import { RampDataGeneric } from './_utils'

export class Analyte extends RampDataGeneric {
  analyteName = ''
  sourceAnalyteIDs = ''
  geneOrCompound = ''
  pathwayName = ''
  pathwayCategory = ''
  pathwayType = ''
  pathwayId = ''

  constructor(obj: Partial<Analyte>) {
    super()

    if (obj.analyteName) {
      this.id = obj.analyteName
      this.analyteName = obj.analyteName
    }
    if (obj.sourceAnalyteIDs) {
      this.sourceAnalyteIDs = obj.sourceAnalyteIDs
        .split(',')
        .sort((a: string, b: string) => a?.localeCompare(b))
        .join('; ')
    }
    if (obj.geneOrCompound) {
      this.geneOrCompound = obj.geneOrCompound
    }
    if (obj.pathwayName) {
      this.pathwayName = obj.pathwayName
    }

    if (obj.pathwayCategory) {
      this.pathwayCategory = obj.pathwayCategory
    }

    if (obj.pathwayType) {
      this.pathwayType = obj.pathwayType
    }

    if (obj.pathwayId) {
      this.pathwayId = obj.pathwayId
    }
  }
}
