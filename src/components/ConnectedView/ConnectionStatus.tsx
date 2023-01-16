import { ArrowPathIcon, BoltIcon, BoltSlashIcon } from "@heroicons/react/24/solid"
import clsx from "clsx"
import { useAtomValue } from "jotai"

import { connectionAtom, ConnectionState } from "../../lib/state"

export const ConnectionStatus: React.FC = () => {
  const connectionState = useAtomValue(connectionAtom)

  return (
    <div className="fixed bottom-4 left-4 overflow-hidden rounded shadow-xl">
      <div
        className={clsx(
          "flex items-center p-2",
          connectionState.connectionState === ConnectionState.Connected &&
            "bg-green-400 text-green-900",
          connectionState.connectionState === ConnectionState.Connecting &&
            "bg-yellow-400 text-yellow-900",
          connectionState.connectionState === ConnectionState.Disconnected &&
            "bg-red-400 text-red-900",
        )}
      >
        {connectionState.connectionState === ConnectionState.Connected && (
          <BoltIcon className="h-4 w-4" />
        )}
        {connectionState.connectionState === ConnectionState.Connecting && (
          <ArrowPathIcon className="h-4 w-4 animate-spin" />
        )}
        {connectionState.connectionState === ConnectionState.Disconnected && (
          <BoltSlashIcon className="h-4 w-4" />
        )}
      </div>
    </div>
  )
}
