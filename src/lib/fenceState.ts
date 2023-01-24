import { invoke } from "./tauri"

export interface IFenceState {
  grpcHostname: string | null
}

export const getState = async (): Promise<IFenceState | null> => {
  const state = await invoke<IFenceState | null>("get_state")

  console.log(state)

  return state
}
