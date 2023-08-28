import { Button, ButtonProps, styled } from '@mui/material'

const ColorButton = styled(Button)<ButtonProps>(({ theme }) => {
  return {
    width: '150px',
    fontWeight: 'bold',
    color: theme.palette.mode === 'dark' ? 'white' : 'black',
    backgroundColor: '#787eff',
    '&:hover': {
      backgroundColor: '#484c99',
    },
  }
})

export default ColorButton
