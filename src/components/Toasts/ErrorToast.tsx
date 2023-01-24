import { IBaseToastProps } from "./BaseToast"

export const ErrorToast: React.FC<IBaseToastProps> = (props) => {
  return (
    <div className="space-y-2">
      <p className="text-xl font-semibold">{props.title}</p>
      <p>{props.body}</p>
    </div>
  )
}
