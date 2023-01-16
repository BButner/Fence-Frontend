import BoltIcon from "@heroicons/react/24/solid/BoltIcon"
import { UnlistenFn } from "@tauri-apps/api/event"
import { motion } from "framer-motion"
import { useAtom } from "jotai"
import { useEffect, useState } from "react"

import { FenceEvent } from "../lib/event"
import { connectionAtom, ConnectionState } from "../lib/state"
import { invoke, listen } from "../lib/tauri"

export const ConnectionSplashScreen: React.FC = () => {
  const [connectionState, setConnectionState] = useAtom(connectionAtom)

  let unlistenConnected: UnlistenFn | null = null
  let unlistenDisconnected: UnlistenFn | null = null

  useEffect(() => {
    return () => {
      console.log("unlisten")
      unlistenConnected?.()
      unlistenDisconnected?.()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const testConnection = async () => {
    unlistenConnected = (await listen(FenceEvent.GrpcConnected, () => {
      console.log("CONNECTED EVENT FIRED")
      setConnectionState({
        ...connectionState,
        connectionState: ConnectionState.Connected,
      })
    })) as UnlistenFn

    unlistenDisconnected = (await listen(FenceEvent.GrpcDisconnected, () => {
      console.log("DISCONNECTED EVENT FIRED")
      setConnectionState({
        ...connectionState,
        connectionState: ConnectionState.InitialConnection,
      })
    })) as UnlistenFn

    setConnectionState({
      ...connectionState,
      connectionState: ConnectionState.Connecting,
    })

    void invoke("test_connect", { hostname: connectionState.hostname }).then((res) => {
      // if (res) {
      // }
    })
  }

  const setHostname = (hostname: string) => {
    setConnectionState({
      ...connectionState,
      hostname,
    })
  }

  return (
    <motion.div
      key="disconnected"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <p className="text-xs font-semibold">Connect to Host</p>
      <input
        value={connectionState.hostname}
        onChange={(e) => setHostname(e.currentTarget.value)}
        type="text"
        placeholder="Hostname"
        className="mt-1 w-96 rounded p-2 text-2xl shadow-lg"
      />
      <button
        onClick={() => void testConnection()}
        className="mt-4 flex items-center space-x-3 shadow-lg"
      >
        <span>Connect</span>
        <BoltIcon className="h-4 w-4" />
      </button>
    </motion.div>
  )
}
