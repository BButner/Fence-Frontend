import { atom } from "jotai"

export enum ConnectionState {
  InitialConnection = "InitialConnection",
  Connecting = "Connecting",
  Connected = "Connected",
  Disconnected = "Disconnected",
}

interface IConnectionState {
  connectionState: ConnectionState
  initialConnection: boolean
  hostname: string
}

export const connectionAtom = atom<IConnectionState>({
  connectionState: ConnectionState.InitialConnection,
  initialConnection: true,
  hostname: "",
})
