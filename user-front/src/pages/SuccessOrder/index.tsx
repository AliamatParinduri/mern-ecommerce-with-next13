import { Box, Stack, Typography, useTheme } from '@mui/material'

import Ceklist from '@/assets/img/Ceklist.png'
import { tokens } from '@/theme'
import { useNavigate } from 'react-router-dom'

const SuccessOrder = () => {
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)
  const navigate = useNavigate()

  return (
    <Stack
      p={2}
      justifyContent='center'
      gap={2}
      alignItems='center'
      bgcolor={colors.secondary[500]}
    >
      <Box
        component='img'
        sx={{
          maxWidth: '25%',
        }}
        alt='Checklist.'
        src={Ceklist}
      />
      <Typography
        variant='h1'
        sx={{ fontSize: { xs: '25px', sm: '35px', md: '50px' } }}
      >
        Order Success Created
      </Typography>
      <Typography
        gutterBottom
        component='a'
        href='#'
        color='inherit'
        display='flex'
        justifyItems='center'
        gap={1}
        justifyContent='center'
        sx={{
          textDecoration: 'underline',
          fontSize: '20px',
        }}
        onClick={() => navigate('/dashboard')}
      >
        Back to Home
      </Typography>
    </Stack>
  )
}

export default SuccessOrder
