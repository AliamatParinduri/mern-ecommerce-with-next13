import { render, screen } from '@testing-library/react'
import { describe, it } from 'vitest'
import { BrowserRouter } from 'react-router-dom'

import App from './App.tsx'
import UserProvider from './context/userContext.tsx'
import ProductsProvider from './context/productContext.tsx'

describe('App', () => {
  it('initial render', () => {
    render(
      <BrowserRouter>
        <UserProvider>
          <ProductsProvider>
            <App />
          </ProductsProvider>
        </UserProvider>
      </BrowserRouter>
    )

    screen.debug()
  })
})
