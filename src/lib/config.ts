import { config } from "process"

import { invoke } from "./tauri"

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

export const getConfig = async (): Promise<IConfigResponse | null> => {
  const config = await invoke<IConfigResponse | null>("get_config")

  console.log(config)

  return config
}
