import { Fragment } from 'react'

const ErrorInputMessage = ({ errorMessage, buttonClick }: any) => {
  return (
    <Fragment>
      {errorMessage && buttonClick && (
        <span className='text-red-500 -mt-3 text-start text-xs md:text-sm'>
          {errorMessage}
        </span>
      )}
    </Fragment>
  )
}

export default ErrorInputMessage
