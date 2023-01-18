export interface IMonitor {
  top: number
  left: number
  width: number
  height: number
  selected: boolean
}

export interface IConfigResponse {
  monitors: IMonitor[]
  lockByDefault: boolean
}
