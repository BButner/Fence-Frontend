import { ArrowPathIcon, BoltIcon, BoltSlashIcon } from "@heroicons/react/24/solid"
import clsx from "clsx"
import { useAtomValue } from "jotai"
import { useEffect } from "react"

import { connectionAtom, ConnectionState } from "../../lib/state"
import styles from "./ConnectionStatus.module.scss"

export const ConnectionStatus: React.FC = () => {
  const connectionState = useAtomValue(connectionAtom)

  const cleanHostname = (hostname: string) => {
    const url = new URL(hostname)
    return url.hostname
  }

  if (connectionState.hostname === "") return <p>no hostname</p>

  return (
    <button
      className={clsx(
        styles.connectionStatusButton,
        "fixed bottom-4 left-4 flex items-center overflow-hidden rounded p-0 shadow-xl",
        connectionState.connectionState === ConnectionState.Connected &&
          " bg-green-200 text-green-900",
        connectionState.connectionState === ConnectionState.Connected &&
          styles.connectionStatusButtonConnected,
        connectionState.connectionState === ConnectionState.Connecting &&
          "bg-yellow-200 text-yellow-900",
        connectionState.connectionState === ConnectionState.Disconnected &&
          "bg-red-200 text-red-900",
      )}
    >
      <div
        className={clsx(
          "p-2",
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
      <p className="m-0 px-2 text-sm font-semibold uppercase">
        {cleanHostname(connectionState.hostname)}
      </p>

      <div
        className={clsx(
          "absolute top-0 left-0 m-0 flex h-full w-full items-center justify-center bg-red-400 p-0 text-white",
          styles.disconnect,
        )}
      >
        <p className="m-0 p-0 text-sm font-semibold">Disconnect</p>
      </div>
    </button>
  )
}
