/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box, Stack, Typography, useTheme } from '@mui/material'

import { tokens } from '@/theme'
import MenuUserInfo from '@/components/MenuUserInfo'
import AddressForm from '@/components/AddressForm'
import { ArrowBack } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'

const CreateAddress = () => {
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)
  const navigate = useNavigate()

  return (
    <Stack p={2} flexDirection={{ sx: 'column', lg: 'row' }} gap={2}>
      <MenuUserInfo />
      <Stack flexGrow={1}>
        <Box
          display='flex'
          justifyContent='space-between'
          mb={1}
          alignItems='center'
        >
          <Box display='flex' flexDirection='row' gap={1}>
            <ArrowBack
              onClick={() => navigate('/addresses')}
              sx={{ cursor: 'pointer' }}
            />
            <Typography gutterBottom variant='h3' mb={2}>
              Create New Address
            </Typography>
          </Box>
        </Box>
        <Box bgcolor={colors.secondary[500]} p={2} sx={{ borderRadius: '8px' }}>
          <AddressForm title='Create Address' />
        </Box>
      </Stack>
    </Stack>
  )
}

export default CreateAddress
