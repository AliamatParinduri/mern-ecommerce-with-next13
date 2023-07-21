import { render, screen } from '@testing-library/react'

describe('App', () => {
  it('initial render', () => {
    render(
      <html lang='en'>
        <body></body>
      </html>
    )

    screen.debug()
  })
})
