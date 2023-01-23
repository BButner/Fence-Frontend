import { AnimatePresence } from "framer-motion"
import { useAtom } from "jotai"
import { useEffect } from "react"

import { ConnectedView } from "../components/ConnectedView"
import { ConnectionSplashScreen } from "../components/ConnectionSplashScreen"
import { getState } from "../lib/fenceState"
import { connectionAtom, ConnectionState } from "../lib/state"

function App() {
  const [connection, setConnection] = useAtom(connectionAtom)

  useEffect(() => {
    void getState().then((state) => {
      console.log(state)
      if (state.grpcHostname !== null) {
        setConnection({
          ...connection,
          connectionState: ConnectionState.Connected,
          hostname: state.grpcHostname,
        })
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
