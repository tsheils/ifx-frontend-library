import { RampDataGeneric } from './_utils'

export class Classes extends RampDataGeneric {
  commonNames!: string
  classyFireSuperClass!: string
  classyFireClass!: string
  classyFireSubClass!: string
  lipidMapsCategory!: string
  lipidMapsMainClass!: string
  lipidMapsSubClass!: string
  sourceId!: string

  constructor(obj: { [key: string]: unknown }) {
    super()
    if (obj['sourceId']) {
      this.id = <string>obj['sourceId']
      this.sourceId = <string>obj['sourceId']
    }
    if (obj['levels']) {
      const arrs: { [key: string]: string }[] = obj['levels'] as {
        [key: string]: string
      }[]
      arrs.forEach((level: { [key: string]: string }) => {
        if (level['common_names']) {
          this.commonNames = <string>level['common_names']
        }

        if (level['class_level_name'] === 'ClassyFire_super_class') {
          this.classyFireSuperClass = <string>level['class_name']
        }
        if (level['class_level_name'] === 'ClassyFire_class') {
          this.classyFireClass = <string>level['class_name']
        }
        if (level['class_level_name'] === 'ClassyFire_sub_class') {
          this.classyFireSubClass = <string>level['class_name']
        }

        if (level['class_level_name'] === 'LipidMaps_category') {
          this.lipidMapsCategory = <string>level['class_name']
        }
        if (level['class_level_name'] === 'LipidMaps_main_class') {
          this.lipidMapsMainClass = <string>level['class_name']
        }
        if (level['class_level_name'] === 'LipidMaps_sub_class') {
          this.lipidMapsSubClass = <string>level['class_name']
        }
      })
    }
  }
}
