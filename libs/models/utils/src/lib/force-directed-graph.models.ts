import { SimulationLinkDatum } from 'd3'
import { SimulationNodeDatum } from 'd3-force'

export class GraphNode implements SimulationNodeDatum {
  id!: string
  label?: string
  type?: string
  color?: string
  index?: number | undefined
  shape?: string
  hovered?: boolean
  clicked?: boolean
  extraClass?: string
  x?: number | undefined
  y?: number | undefined
  vx?: number | undefined
  vy?: number | undefined
  fx?: number | null | undefined
  fy?: number | null | undefined

  constructor(obj: Partial<GraphNode>) {
    Object.assign(this, obj)
  }
}

export class GraphLink implements SimulationLinkDatum<GraphNode> {
  source!: string
  target!: string
  label?: string
  id!: string
  index!: number
  type?: string
  color?: string
  hovered?: boolean
  clicked?: boolean

  constructor(obj: Partial<GraphLink>) {
    Object.assign(this, obj)
  }
}
