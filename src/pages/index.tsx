import { AnimatePresence } from "framer-motion"
import { useAtom } from "jotai"
import { useEffect } from "react"
import { toast, ToastContainer } from "react-toastify"

import { ConnectedView } from "../components/ConnectedView"
import { ConnectionSplashScreen } from "../components/ConnectionSplashScreen"
import { ErrorToast } from "../components/Toasts/ErrorToast"
import { getState } from "../lib/fenceState"
import { connectionAtom, ConnectionState } from "../lib/state"
import { listen } from "../lib/tauri"

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

    const unlisten = listen("fence-error", (e) => {
      console.log(e)
      const payload: { message: string; title: string } = e.payload as {
        message: string
        title: string
      }

      toast.error(<ErrorToast title={payload.title} body={payload.message} />)
    })

    return () => {
      unlisten.then((f) => f())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <AnimatePresence mode="wait">
        {(connection.connectionState === ConnectionState.InitialConnection ||
          connection.connectionState === ConnectionState.ConnectionFailed) && (
          <ConnectionSplashScreen />
        )}
        {connection.connectionState === ConnectionState.Connecting && (
          <p>Connecting...</p>
        )}
        {connection.connectionState === ConnectionState.Connected && <ConnectedView />}
      </AnimatePresence>

      <div className="fixed top-0 right-0 w-2/3">
        <ToastContainer className="w-2/3" position="top-right" closeOnClick draggable />
      </div>
    </div>
  )
}

export default App
