/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from 'axios'
import { useState, useEffect } from 'react'
import {
  Avatar,
  Box,
  Button,
  Stack,
  TextField,
  Typography,
  useTheme,
} from '@mui/material'

import { BaseURLUsers, BaseURLV1 } from '@/config/api'
import { UserState, userContextType } from '@/context/userContext'
import { tokens } from '@/theme'
import MenuUserInfo from '@/components/MenuUserInfo'
import Loading from '@/assets/svg/Loading'
import ColorButton from '@/components/ColorButton'
import { useNavigate } from 'react-router-dom'
import { ToastError, ToastSuccess } from '@/components/Toast'
import { isUserLogin } from '@/validations/shared'

const EditProfile = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [fullName, setFullName] = useState('')
  const [noHP, setNoHP] = useState('')
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const { setUser }: userContextType = UserState()
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)
  const navigate = useNavigate()
  let { user }: userContextType = UserState()

  const editProfile = async (e: any) => {
    e.preventDefault()

    setIsLoading(true)
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user!.token}`,
        },
      }

      const payload = {
        fullName,
        username,
        noHP,
        email,
      }

       await axios.put(
        `${BaseURLV1}/users/${user!._id}`,
        payload,
        config
      )

      const newUser = {
        ...user,
        fullName,
        username,
        noHP,
        email,
      }

      localStorage.setItem('userLogin', JSON.stringify(newUser))

      setUser({
        ...newUser,
      })
      ToastSuccess('Success update profile')
      setIsLoading(false)
    } catch (e: any) {
      setIsLoading(false)
      const description = e.response?.data?.description
      ToastError(description ? description : 'Failed edit Profile')
      return false
    }
  }

  const updateFotoProfile = async (e: any) => {
    e.preventDefault()

    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append('image', e.target.files[0])

      const config = {
        headers: {
          Authorization: `Bearer ${user!.token}`,
        },
      }

      const {
        data: { data },
      } = await axios.put(
        `${BaseURLV1}/users/${user!._id}/updateProfileImage`,
        formData,
        config
      )

      const newUser = {
        ...user,
        userPic: data.userPic,
      }

      localStorage.setItem('userLogin', JSON.stringify(newUser))

      setUser({
        ...newUser,
      })

      ToastSuccess('Success update profile image')
      setIsLoading(false)
    } catch (e: any) {
      setIsLoading(false)
      const description = e.response?.data?.description
      ToastError(description ? description : 'Failed update Foto Profile')
      return false
    }
  }

  useEffect(() => {
    if (isUserLogin(user)) {
      user = isUserLogin(user)
    }

    const userLogin = localStorage.getItem('userLogin')

    if (user) {
      setFullName(user.fullName)
      setUsername(user.username)
      setEmail(user.email)
      setNoHP(user.noHP)
    } else if (!user && !userLogin) {
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
          <Typography gutterBottom variant='h3' mb={2}>
            Edit Profile
          </Typography>
          <ColorButton onClick={() => navigate('/profile')}>
            Back To Profile
          </ColorButton>
        </Box>
        <Box>{isLoading && <Loading value='80' />}</Box>
        {!isLoading && !user && (
          <Box
            bgcolor={colors.secondary[500]}
            p={2}
            sx={{ borderRadius: '8px' }}
          >
            <Typography gutterBottom variant='h5'>
              No Data
            </Typography>
          </Box>
        )}
        {!isLoading && user && (
          <Stack gap={4}>
            <Box display='flex' justifyContent='space-between' gap={3}>
              <Stack
                bgcolor={colors.secondary[500]}
                py={2}
                display='flex'
                alignItems='center'
                width={1 / 3}
                height='150px'
                gap={2}
                sx={{
                  borderRadius: '8px',
                }}
              >
                <Avatar
                  alt={user!.fullName}
                  src={`${BaseURLUsers}/${user!.userPic}`}
                  sx={{ width: 72, height: 72, margin: 'auto' }}
                />
                <Button
                  variant='contained'
                  component='label'
                  onChange={updateFotoProfile}
                  sx={{
                    width: '150px',
                    fontWeight: 'bold',
                    backgroundColor: '#787eff',
                    '&:hover': {
                      backgroundColor: '#484c99',
                    },
                  }}
                >
                  Upload File
                  <input type='file' hidden />
                </Button>
              </Stack>
              <Stack
                bgcolor={colors.secondary[500]}
                width={2 / 3}
                py={1}
                px={2}
                sx={{
                  borderRadius: '8px',
                }}
              >
                <form onSubmit={editProfile}>
                  <Box marginBottom={1}>
                    <label>Full Name :</label>
                    <TextField
                      fullWidth
                      autoComplete='full Name'
                      type='text'
                      placeholder='full Name'
                      sx={{
                        marginTop: '5px',
                      }}
                      onChange={(e) => setFullName(e.target.value)}
                      value={fullName}
                    />
                  </Box>
                  <Box marginBottom={1}>
                    <label>Username :</label>
                    <TextField
                      fullWidth
                      aria-readonly={true}
                      autoComplete='Username'
                      type='text'
                      placeholder='Username'
                      sx={{
                        marginTop: '5px',
                      }}
                      value={username}
                    />
                  </Box>
                  <Box marginBottom={1}>
                    <label>Email :</label>
                    <TextField
                      fullWidth
                      aria-readonly={true}
                      autoComplete='Email'
                      type='text'
                      placeholder='Email'
                      sx={{
                        marginTop: '5px',
                      }}
                      value={email}
                    />
                  </Box>
                  <Box marginBottom={1}>
                    <label>No Handphone :</label>
                    <TextField
                      fullWidth
                      autoComplete='Email'
                      type='number'
                      placeholder='Email'
                      sx={{
                        marginTop: '5px',
                      }}
                      onChange={(e) => setNoHP(e.target.value)}
                      value={noHP}
                    />
                  </Box>
                  <Button fullWidth type='submit' variant='contained'>
                    {isLoading ? 'loading...' : 'Update Profile'}
                  </Button>
                </form>
              </Stack>
            </Box>
          </Stack>
        )}
      </Stack>
    </Stack>
  )
}

export default EditProfile
