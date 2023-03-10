import { motion } from "framer-motion"

import { ConnectionStatus } from "./ConnectedView/ConnectionStatus"
import { MonitorView } from "./ConnectedView/MonitorView"
import { SettingsView } from "./ConnectedView/SettingsView"

export const ConnectedView: React.FC = () => {
  // TODO:
  // implement the styling from Alphas repo
  // monitors in the middle
  // connection status/disconnect button at the bottom left
  // - green if connected
  // - red if disconnected
  // - yellow if connecting
  // - if connected, on hover, show disconnect button
  // settings button at the bottom right
  // big 'ol lock in the middle
  return (
    <motion.div
      key="connected"
      className="flex h-full w-full flex-col items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <ConnectionStatus />
      <SettingsView />

      <MonitorView />
    </motion.div>
  )
}
