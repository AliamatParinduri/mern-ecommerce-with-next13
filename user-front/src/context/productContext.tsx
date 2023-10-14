'use client'

import { createContext, useContext, useState } from 'react'

export type ProductsContextType = {
  products?: any
  setProducts?: any
}

const ProductsContext = createContext({})

const ProductsProvider = ({ children }: any) => {
  const [products, setProducts] = useState([])

  return (
    <ProductsContext.Provider value={{ products, setProducts }}>
      {children}
    </ProductsContext.Provider>
  )
}

export const ProductsState = () => {
  return useContext(ProductsContext)
}

export default ProductsProvider
