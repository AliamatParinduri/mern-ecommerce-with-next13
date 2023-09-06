/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect } from 'react'
import { Box, Stack, Typography, useTheme } from '@mui/material'
import { useNavigate } from 'react-router-dom'

import { tokens } from '@/theme'
import MenuUserInfo from '@/components/MenuUserInfo'
import AddressForm from '@/components/AddressForm'
import { ArrowBack } from '@mui/icons-material'
import { ToastError } from '@/components/Toast'
import { UserState, userContextType } from '@/context/userContext'

const EditAddress = () => {
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)
  const navigate = useNavigate()
  const { user, setUser }: userContextType = UserState()

  useEffect(() => {
    const userLogin = localStorage.getItem('userLogin')

    if (!user && !userLogin) {
      setUser(null)
      ToastError('Your session has ended, Please login again')
      navigate('/login')
    }
  }, [user])

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
              Edit Address
            </Typography>
          </Box>
        </Box>
        <Box bgcolor={colors.secondary[500]} p={2} sx={{ borderRadius: '8px' }}>
          <AddressForm title='Update Address' />
        </Box>
      </Stack>
    </Stack>
  )
}

export default EditAddress
