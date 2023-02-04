import { config } from "process"

import { invoke } from "./tauri"

export interface IMonitor {
  top: number
  left: number
  width: number
  height: number
  selected: boolean
  id: string
}

export interface IConfigResponse {
  monitors: IMonitor[]
  lockByDefault: boolean
}

export const getConfig = async (): Promise<IConfigResponse | null> => {
  const config = await invoke<IConfigResponse | null>("get_config")

  return config
}
