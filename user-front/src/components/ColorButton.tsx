import { Button, ButtonProps, styled } from '@mui/material'

const ColorButton = styled(Button)<ButtonProps>(({ theme }) => ({
  width: '150px',
  fontWeight: 'bold',
  backgroundColor: '#787eff',
  '&:hover': {
    backgroundColor: '#484c99',
  },
}))

export default ColorButton
