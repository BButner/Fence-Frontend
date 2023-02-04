import "../styles/style.scss"
import "react-toastify/dist/ReactToastify.css"

import { useAtom } from "jotai"
import type { AppProps } from "next/app"
import { useEffect } from "react"

import { FenceEvent } from "../lib/event"
import { getState } from "../lib/fenceState"
import { connectionAtom, ConnectionState } from "../lib/state"
import { listen } from "../lib/tauri"

export default function MyApp({ Component, pageProps }: AppProps) {
  const [connectionState, setConnectionState] = useAtom(connectionAtom)

  useEffect(() => {
    const unlistenConnected = listen(FenceEvent.GrpcConnected, () => {
      console.log("CONNECTED EVENT FIRED")
      void getState().then((state) => {
        setConnectionState({
          ...connectionState,
          connectionState: ConnectionState.Connected,
          initialConnection: false,
          hostname: state.grpcHostname,
        })
      })
    })

    const unlistenDisconnected = listen(FenceEvent.GrpcDisconnected, () => {
      console.log("DISCONNECTED EVENT FIRED")
      setConnectionState({
        ...connectionState,
        connectionState: ConnectionState.InitialConnection,
        hostname: "",
      })
    })

    const unlistenConnectionFailed = listen(FenceEvent.GrpcConnectionFailed, () => {
      console.log("CONNECTION FAILED EVENT FIRED")
      setConnectionState({
        ...connectionState,
        connectionState: ConnectionState.ConnectionFailed,
      })
    })

    return () => {
      unlistenConnected.then((f) => f())
      unlistenDisconnected.then((f) => f())
      unlistenConnectionFailed.then((f) => f())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <Component {...pageProps} />
}
