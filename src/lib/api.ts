import { IMonitor } from "./config"
import { invoke } from "./tauri"

export const toggleMonitorSelected = async (
  monitor: IMonitor,
): Promise<IMonitor | null> => {
  return invoke("select_monitor", { monitor }).then((monitor) => {
    return monitor as IMonitor
  })
}
