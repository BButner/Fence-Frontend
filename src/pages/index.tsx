import { BoltIcon } from "@heroicons/react/24/solid"
import { AnimatePresence, motion } from "framer-motion"
import { useAtomValue } from "jotai"
import { useState } from "react"

import { Connect } from "../components/connect"
import { Connected } from "../components/connected"
import { connectionAtom, ConnectionState } from "../lib/state"
import { invoke } from "../lib/tauri"

function App() {
  const connection = useAtomValue(connectionAtom)

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <AnimatePresence mode="wait">
        {connection.connectionState === ConnectionState.Disconnected &&
          connection.initialConnection && <Connect />}
        {connection.connectionState === ConnectionState.Connecting && (
          <p>Connecting...</p>
        )}
        {connection.connectionState === ConnectionState.Connected && <Connected />}
      </AnimatePresence>
    </div>
  )
}

export default App
