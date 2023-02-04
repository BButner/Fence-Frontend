import { useAtom, useAtomValue } from "jotai"
import { useEffect, useState } from "react"

import { getConfig, IConfigResponse } from "../../lib/config"
import { configAtom } from "../../lib/state"
import { listen } from "../../lib/tauri"

export const MonitorView: React.FC = () => {
  const [config, setConfig] = useAtom(configAtom)
  const [canvasWidth, setCanvasWidth] = useState<number>(0)
  const [canvasHeight, setCanvasHeight] = useState<number>(0)
  const [topOffset, setTopOffset] = useState<number>(0)
  const [leftOffset, setLeftOffset] = useState<number>(0)

  const [cursorPosition, setCursorPosition] = useState<[number, number]>([0, 0])

  const factor = 0.1

  const updateMonitors = () => {
    const lowestLeftMonitor = config.monitors.reduce((acc, monitor) => {
      return monitor.left < acc.left ? monitor : acc
    })

    const lowestTopMonitor = config.monitors.reduce((acc, monitor) => {
      return monitor.top < acc.top ? monitor : acc
    })

    if (lowestLeftMonitor.left < 0) {
      setLeftOffset(Math.abs(lowestLeftMonitor.left))
    }

    if (lowestTopMonitor.top < 0) {
      setTopOffset(Math.abs(lowestTopMonitor.top))
    }

    const highestRightMonitor = config.monitors.reduce((acc, monitor) => {
      return monitor.left + monitor.width > acc.left + acc.width ? monitor : acc
    })

    const highestBottomMonitor = config.monitors.reduce((acc, monitor) => {
      return monitor.top + monitor.height > acc.top + acc.height ? monitor : acc
    })

    setCanvasWidth(
      (highestRightMonitor.left + highestRightMonitor.width + leftOffset) * factor,
    )
    setCanvasHeight(
      (highestBottomMonitor.top + highestBottomMonitor.height + topOffset) * factor,
    )
  }

  useEffect(() => {
    if (config === null) {
      void getConfig().then((c) => {
        console.log(c)
        setConfig(c)
      })
    } else {
      updateMonitors()
    }

    const unlisten = listen("mouse-location", (event) => {
      // console.log(event)
      setCursorPosition([event.payload.x - 10, event.payload.y - 10])
    })

    return () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      void unlisten.then((f) => f())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config, leftOffset, topOffset])

  if (!config) {
    return <p>Config null...</p>
  }

  return (
    <div className="rounded bg-gray-200 p-4">
      <div style={{ width: canvasWidth, height: canvasHeight }} className="relative">
        {config.monitors.map((monitor, index) => {
          return (
            <div
              key={index}
              style={{
                width: monitor.width * factor,
                height: monitor.height * factor,
                top: monitor.top * factor + topOffset * factor,
                left: monitor.left * factor + leftOffset * factor,
              }}
              className="absolute p-0.5"
            >
              <button className="block h-full w-full border-2 border-sky-600 bg-sky-200/50 text-sky-800 hover:bg-sky-200">
                <p>
                  {monitor.width}x{monitor.height}
                </p>
                <small>
                  x: {monitor.left} y: {monitor.top}
                </small>
              </button>
            </div>
          )
        })}

        <div
          className="absolute rounded-full bg-violet-400 shadow-xl"
          style={{
            width: 10,
            height: 10,
            top: (cursorPosition[1] + topOffset) * factor,
            left: (cursorPosition[0] + leftOffset) * factor,
          }}
        ></div>
      </div>
    </div>
  )
}
