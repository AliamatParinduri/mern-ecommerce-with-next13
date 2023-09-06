import Image from 'next/image'
import { useState, useEffect } from 'react'
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai'
import Swipe from 'react-easy-swipe'
import { BaseURLUsers } from '@/config/api'
import Product from 'public/image/product.png'

const Carousel = ({ from, title, datas }: any) => {
  const [currentSlide, setCurrentSlide] = useState(0)
  let dt

  useEffect(() => {
    // setInterval(() => {
    //   let newSlide =
    //     currentSlide === CarouselData.length - 1 ? 0 : currentSlide + 1
    //   setCurrentSlide(newSlide)
    // }, 15000)
  }, [])

  const nextSlide = () => {
    let newSlide = currentSlide === datas.length - 1 ? 0 : currentSlide + 1

    setCurrentSlide(newSlide)
  }

  const prevSlide = () => {
    let newSlide = currentSlide === 0 ? datas.length - 1 : currentSlide - 1
    setCurrentSlide(newSlide)
  }

  return (
    <div className='w-full'>
      <div className='flex h-full overflow-hidden relative'>
        <AiOutlineLeft
          onClick={prevSlide}
          className='absolute left-0 text-3xl inset-y-1/2 text-white cursor-pointer'
        />

        <Swipe
          className='w-full h-72'
          onSwipeLeft={nextSlide}
          onSwipeRight={prevSlide}
        >
          {datas.map((data: any, index: number) => {
            dt = from === 'user' ? data.category : data.subCategory

            return (
              <div
                key={index}
                className='flex w-full h-72'
                style={{
                  display: index === currentSlide ? 'flex' : 'none',
                  backgroundColor: '#666CFF',
                  borderRadius: '8px',
                }}
              >
                <div className='flex flex-col p-4 w-full'>
                  <div className='flex'>
                    <div className='flex h-8 w-8 relative text-xs bg-boxDark-500 rounded-full justify-center items-center'>
                      {currentSlide + 1}
                    </div>
                  </div>
                  <div className='flex h-1/3 justify-between'>
                    <div className='flex flex-col justify-center'>
                      <div>{title}</div>
                      <div className='mt-1'>
                        {from === 'user' ? data.fullName : data.category}
                      </div>
                    </div>
                    <div className='flex'>
                      <div className='h-20 w-20 relative'>
                        <Image
                          src={
                            from === 'user'
                              ? `${BaseURLUsers}/${data.pic}`
                              : Product
                          }
                          alt='Picture of the author'
                          layout='fill'
                          objectFit='cover'
                          className='rounded-full'
                        />
                      </div>
                    </div>
                  </div>
                  <div className='flex h-2/3 flex-col justify-center'>
                    <div className='grid grid-cols-3 lg:grid-cols-2 gap-4'>
                      {dt.map((category: any) => (
                        <div
                          key={
                            from === 'user'
                              ? category.category
                              : category._id[0]
                          }
                          className='flex gap-1'
                        >
                          <div className='flex justify-center text-xs items-center w-6 h-6 bg-boxDark-500 rounded '>
                            {category.count}
                          </div>
                          <div>
                            {from === 'user'
                              ? category.category
                              : category._id[0]}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </Swipe>

        <div className='absolute w-full flex justify-center bottom-0'>
          {datas.map((data: any, index: number) => {
            return (
              <div
                className={
                  index === currentSlide
                    ? 'h-2 w-2 bg-blue-700 rounded-full mx-2 mb-2 cursor-pointer'
                    : 'h-2 w-2 bg-white rounded-full mx-2 mb-2 cursor-pointer'
                }
                key={index}
                onClick={() => {
                  setCurrentSlide(index)
                }}
              ></div>
            )
          })}
        </div>

        <AiOutlineRight
          onClick={nextSlide}
          className='absolute right-0 text-3xl inset-y-1/2 text-white cursor-pointer'
        />
      </div>
    </div>
  )
}

export default Carousel
