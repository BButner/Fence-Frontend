import BoltIcon from "@heroicons/react/24/solid/BoltIcon"
import { UnlistenFn } from "@tauri-apps/api/event"
import clsx from "clsx"
import { motion } from "framer-motion"
import { useAtom, useSetAtom } from "jotai"
import { useEffect, useState } from "react"

import { IConfigResponse } from "../lib/config"
import { FenceEvent } from "../lib/event"
import { configAtom, connectionAtom, ConnectionState } from "../lib/state"
import { invoke, listen } from "../lib/tauri"

export const ConnectionSplashScreen: React.FC = () => {
  const [connectionState, setConnectionState] = useAtom(connectionAtom)
  const [config, setConfig] = useAtom(configAtom)

  const testConnection = async () => {
    setConnectionState({
      ...connectionState,
      connectionState: ConnectionState.Connecting,
      hostname: connectionState.hostname,
    })

    void invoke("connect_grpc", { hostname: connectionState.hostname }).then((res) => {
      if (res) {
        void invoke("get_config").then((response) => {
          if (response) {
            setConfig(response)
          }
        })
      }
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
        className={clsx(
          "mt-1 w-96 rounded p-2 text-2xl shadow-lg outline-none transition duration-200 focus:ring-4 focus:ring-violet-400/50",
          connectionState.connectionState === ConnectionState.ConnectionFailed
            ? "ring-2 ring-red-400 focus:ring-4 focus:ring-red-400"
            : "",
        )}
      />
      <button
        onClick={() => void testConnection()}
        className="mt-4 flex items-center space-x-3 shadow-lg outline-none transition duration-200 focus:ring-4 focus:ring-violet-400/50"
      >
        <span>Connect</span>
        <BoltIcon className="h-4 w-4" />
      </button>
    </motion.div>
  )
}
