import { EventCallback, UnlistenFn } from "@tauri-apps/api/event"
import type { InvokeArgs } from "@tauri-apps/api/tauri"

const isNode = (): boolean =>
  Object.prototype.toString.call(typeof process !== "undefined" ? process : 0) ===
  "[object process]"

export async function invoke<T>(
  cmd: string,
  args?: InvokeArgs | undefined,
): Promise<T> {
  if (isNode()) {
    // This shouldn't ever happen when React fully loads
    return Promise.resolve(undefined as unknown as T)
  }
  const tauriAppsApi = await import("@tauri-apps/api")
  const tauriInvoke = tauriAppsApi.invoke
  return tauriInvoke(cmd, args)
}

export async function listen(
  event: string,
  callback: EventCallback<unknown>,
): Promise<UnlistenFn | void> {
  if (isNode()) {
    // This shouldn't ever happen when React fully loads
    return Promise.resolve()
  }
  const tauriAppsApi = await import("@tauri-apps/api/event")
  const tauriListen = tauriAppsApi.listen
  return tauriListen(event, callback)
}
