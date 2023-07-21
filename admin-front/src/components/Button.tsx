import Loading from '@/components/Loading'

type Props = {
  setButtonClick: (val: boolean) => void
  isLoading: boolean
  title: string
}

const Button = ({ title, isLoading, setButtonClick }: Props) => {
  return (
    <button
      onClick={() => setButtonClick(true)}
      type='submit'
      className='flex gap-2 justify-center items-center bg-slate-900 py-3 rounded-lg text-white'
      disabled={isLoading}
    >
      {isLoading ? <Loading /> : title}
    </button>
  )
}

export default Button
