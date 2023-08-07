'use client'

import { createContext, useContext, useState } from 'react'

export type ProductsContextType = {
  products?: any
  setProducts?: any
}

const ProductsContext = createContext({})

const ProductsProvider = (props: any) => {
  const [products, setProducts] = useState([])

  return (
    <ProductsContext.Provider value={{ products, setProducts }}>
      {props.children}
    </ProductsContext.Provider>
  )
}

export const ProductsState = () => {
  return useContext(ProductsContext)
}

export default ProductsProvider
