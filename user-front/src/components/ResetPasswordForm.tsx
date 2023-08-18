import axios from 'axios'
import { useState } from 'react'
import { useFormik, Form, FormikProvider } from 'formik'
import { useNavigate } from 'react-router-dom'
import {
  Stack,
  Box,
  TextField,
  useTheme,
  InputAdornment,
  IconButton,
} from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { motion } from 'framer-motion'

import { tokens } from '@/theme'
import { RemoveRedEyeOutlined, VisibilityOff } from '@mui/icons-material'
import { BaseURLV1 } from '@/config/api'
import { NewPasswordSchema } from '@/validations/userValidation'

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

const ResetPasswordForm = ({ id }: any) => {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleResetPassword = async () => {
    setIsLoading(true)
    try {
      const {
        data: { data, token, message },
      } = await axios.put(`${BaseURLV1}/auth/${id}/createNewPassword`, {
        password: formik.values.password,
      })
      alert(message)
      setIsLoading(false)
      navigate('/login')
    } catch (e: any) {
      setIsLoading(false)
      alert(e.response.data.description)
    }
  }

  const initialValues: { password: string; confirmPassword: string } = {
    password: '',
    confirmPassword: '',
  }

  const formik = useFormik({
    initialValues,
    validationSchema: NewPasswordSchema,
    onSubmit: handleResetPassword,
  })

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik

  return (
    <FormikProvider value={formik}>
      <Form autoComplete='off' noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <Stack
            spacing={3}
            component={motion.div}
            initial={{ opacity: 0, y: 40 }}
            animate={animate}
          >
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
              SUBMIT
            </LoadingButton>
          </Box>
        </Stack>
      </Form>
    </FormikProvider>
  )
}

export default ResetPasswordForm
