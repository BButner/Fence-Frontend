import { atom } from "jotai"

import { IConfigResponse } from "./config"

export enum ConnectionState {
  InitialConnection = "InitialConnection",
  Connecting = "Connecting",
  Connected = "Connected",
  Disconnected = "Disconnected",
  ConnectionFailed = "ConnectionFailed",
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

export const configAtom = atom<IConfigResponse | null>(null)
