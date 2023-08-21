import './Loading.css'

const Loading = (width: any) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={width.value}
      version='1.1'
      viewBox='0 0 132 58'
    >
      <g
        id='Page-1'
        fill='none'
        fillRule='evenodd'
        stroke='none'
        strokeWidth='1'
      >
        <g id='dots' fill='#A3A3A3'>
          <circle id='dot1' cx='25' cy='30' r='13'></circle>
          <circle id='dot2' cx='65' cy='30' r='13'></circle>
          <circle id='dot3' cx='105' cy='30' r='13'></circle>
        </g>
      </g>
    </svg>
  )
}

export default Loading
