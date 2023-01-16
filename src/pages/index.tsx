import { AnimatePresence } from "framer-motion"
import { useAtomValue } from "jotai"

import { ConnectedView } from "../components/ConnectedView"
import { ConnectionSplashScreen } from "../components/ConnectionSplashScreen"
import { connectionAtom, ConnectionState } from "../lib/state"

function App() {
  const connection = useAtomValue(connectionAtom)

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <AnimatePresence mode="wait">
        {connection.connectionState === ConnectionState.InitialConnection && (
          <ConnectionSplashScreen />
        )}
        {connection.connectionState === ConnectionState.Connecting && (
          <p>Connecting...</p>
        )}
        {connection.connectionState === ConnectionState.Connected && <ConnectedView />}
      </AnimatePresence>
    </div>
  )
}

export default App
