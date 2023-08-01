import { useState } from 'react'
import { ReactSortable } from 'react-sortablejs'
import Loading from './Loading'

type Props = {
  title: string
  formik?: any
  name: string
  images?: any
  readonly?: boolean
  setFile: any
  multiple: any
  buttonClick?: boolean
}

const InputFile = ({
  title,
  images: existingImages,
  formik,
  name,
  setFile,
  multiple,
  readonly = false,
  buttonClick,
}: Props) => {
  const [isUploading, setIsUploading] = useState(false)
  const [images, setImages] = useState(existingImages || [])

  async function uploadImages(e: any) {
    multiple ? setFile(e.target.files) : setFile(e.target.files[0])
  }

  function updateImagesOrder(images: any) {
    setImages(images)
  }

  return (
    <div className='flex flex-col text-start justify-start gap-2'>
      <span className='font-semibold dark:text-white'>{title}</span>
      <div className='mb-2 flex flex-wrap gap-1'>
        {!!images?.length &&
          images.map((link: any) => (
            <div
              key={link}
              className='h-24 bg-white p-4 shadow-sm rounded-sm border border-gray-200'
            >
              <img src={link} alt='' className='rounded-lg' />
            </div>
          ))}
        {isUploading && (
          <div className='h-24 flex items-center'>
            <Loading />
          </div>
        )}
        <label className='w-24 h-24 cursor-pointer text-black dark:text-white text-center flex flex-col items-center justify-center text-sm gap-1 text-primary rounded-sm bg-light-500 dark:bg-dark-500 shadow-sm border border-primary'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='w-6 h-6'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5'
            />
          </svg>
          <div>Add image</div>
          <input
            type='file'
            onChange={uploadImages}
            multiple={multiple}
            className='hidden'
          />
        </label>
      </div>
    </div>
  )
}

export default InputFile
