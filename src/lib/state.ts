import { atom } from "jotai"

export enum ConnectionState {
  Connected = "Connected",
  Disconnected = "Disconnected",
  Connecting = "Connecting",
}

interface IConnectionState {
  connectionState: ConnectionState
  initialConnection: boolean
}

export const connectionAtom = atom<IConnectionState>({
  connectionState: ConnectionState.Disconnected,
  initialConnection: true,
})
