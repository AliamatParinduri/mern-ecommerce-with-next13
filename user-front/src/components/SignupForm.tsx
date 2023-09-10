import axios from 'axios'
import { useState } from 'react'
import { useFormik, Form, FormikProvider } from 'formik'
import { useNavigate } from 'react-router-dom'
import {
  Stack,
  Box,
  TextField,
  IconButton,
  InputAdornment,
  useTheme,
} from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { motion } from 'framer-motion'

import { RemoveRedEyeOutlined, VisibilityOff } from '@mui/icons-material'
import { tokens } from '@/theme'
import { RegisterDTO } from '@/validations/shared'
import { RegisterSchema } from '@/validations/userValidation'
import { BaseURLV1 } from '@/config/api'
import { ToastError, ToastSuccess } from './Toast'

const easing = [0.6, -0.05, 0.01, 0.99]
const animate = {
  opacity: 1,
  y: 0,
  transition: {
    duration: 0.6,
    ease: easing,
    delay: 0.16,
  },
}

const SignupForm = () => {
  const navigate = useNavigate()
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleSignupUser = async () => {
    const payload = {
      fullName: formik.values.fullName,
      username: formik.values.username,
      email: formik.values.email.toLowerCase(),
      noHP: formik.values.noHP,
      password: formik.values.password,
    }
    try {
      const {
        data: { message },
      } = await axios.post(`${BaseURLV1}/auth/register`, payload)
      ToastSuccess(message)
      navigate('/login')
    } catch (e: any) {
      ToastError(e.response.data.description)
    }
  }

  const initialValues: RegisterDTO = {
    fullName: '',
    username: '',
    email: '',
    noHP: '',
    password: '',
    confirmPassword: '',
  }

  const formik = useFormik({
    initialValues,
    validationSchema: RegisterSchema,
    onSubmit: handleSignupUser,
  })

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik

  return (
    <FormikProvider value={formik}>
      <Form autoComplete='off' noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <Stack
            component={motion.div}
            initial={{ opacity: 0, y: 60 }}
            animate={animate}
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
          >
            <TextField
              fullWidth
              label='Full name'
              {...getFieldProps('fullName')}
              error={Boolean(touched.fullName && errors.fullName)}
              helperText={touched.fullName && errors.fullName}
            />
          </Stack>

          <Stack
            spacing={3}
            component={motion.div}
            initial={{ opacity: 0, y: 40 }}
            animate={animate}
          >
            <TextField
              fullWidth
              autoComplete='username'
              type='text'
              label='Username'
              {...getFieldProps('username')}
              error={Boolean(touched.username && errors.username)}
              helperText={touched.username && errors.username}
            />

            <TextField
              fullWidth
              autoComplete='email'
              type='email'
              label='Email address'
              {...getFieldProps('email')}
              error={Boolean(touched.email && errors.email)}
              helperText={touched.email && errors.email}
            />

            <TextField
              fullWidth
              autoComplete='No Handphone'
              type='text'
              label='No Handphone'
              {...getFieldProps('noHP')}
              error={Boolean(touched.noHP && errors.noHP)}
              helperText={touched.noHP && errors.noHP}
            />

            <TextField
              fullWidth
              autoComplete='current-password'
              type={showPassword ? 'text' : 'password'}
              label='Password'
              {...getFieldProps('password')}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton
                      edge='end'
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? (
                        <VisibilityOff />
                      ) : (
                        <RemoveRedEyeOutlined />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              error={Boolean(touched.password && errors.password)}
              helperText={touched.password && errors.password}
            />
            <TextField
              fullWidth
              autoComplete='confirmPassword'
              type={showConfirmPassword ? 'text' : 'password'}
              label='Confirm Password'
              {...getFieldProps('confirmPassword')}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton
                      edge='end'
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                    >
                      {showConfirmPassword ? (
                        <VisibilityOff />
                      ) : (
                        <RemoveRedEyeOutlined />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              error={Boolean(touched.confirmPassword && errors.confirmPassword)}
              helperText={touched.confirmPassword && errors.confirmPassword}
            />
          </Stack>

          <Box
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={animate}
          >
            <LoadingButton
              fullWidth
              size='large'
              type='submit'
              variant='contained'
              loading={isSubmitting}
              sx={{
                bgcolor: colors.primary[500],
              }}
            >
              Sign up
            </LoadingButton>
          </Box>
        </Stack>
      </Form>
    </FormikProvider>
  )
}

export default SignupForm
