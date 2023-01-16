import BoltIcon from "@heroicons/react/24/solid/BoltIcon"
import { motion } from "framer-motion"
import { useAtom } from "jotai"
import { useState } from "react"

import { connectionAtom, ConnectionState } from "../lib/state"
import { invoke } from "../lib/tauri"

export const Connect: React.FC = () => {
  const [hostname, setHostname] = useState<string>("")
  const [connectionState, setConnectionState] = useAtom(connectionAtom)

  const testConnection = () => {
    setConnectionState({
      ...connectionState,
      connectionState: ConnectionState.Connecting,
    })

    void invoke("test_connect", { hostname }).then((res) => {
      if (res) {
        setConnectionState({
          ...connectionState,
          connectionState: ConnectionState.Connected,
          initialConnection: false,
        })
      } else {
        setConnectionState({
          ...connectionState,
          connectionState: ConnectionState.Disconnected,
          initialConnection: true,
        })
      }
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
        value={hostname}
        onChange={(e) => setHostname(e.currentTarget.value)}
        type="text"
        placeholder="Hostname"
        className="mt-1 w-96 rounded p-2 text-2xl shadow-lg"
      />
      <button
        onClick={testConnection}
        className="mt-4 flex items-center space-x-3 shadow-lg"
      >
        <span>Connect</span>
        <BoltIcon className="h-4 w-4" />
      </button>
    </motion.div>
  )
}
