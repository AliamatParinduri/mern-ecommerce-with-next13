import { toast } from 'react-toastify'

export const ToastInfo = (msg: string) => toast.info(msg)
export const ToastSuccess = (msg: string) => toast.success(msg)
export const ToastWarn = (msg: string) => toast.warn(msg)
export const ToastError = (msg: string) => toast.error(msg)
