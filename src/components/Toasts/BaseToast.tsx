import { ToastProps } from "react-toastify/dist/types"

export interface IBaseToastProps {
  closeToast?: () => void
  toastProps?: ToastProps
  title: string
  body: string
}
