import { useState } from 'react'
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom'
import { Form, FormikProvider, useFormik } from 'formik'
import axios from 'axios'
import {
  Box,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  TextField,
  useTheme,
} from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { motion } from 'framer-motion'

import { tokens } from '@/theme'
import { RemoveRedEyeOutlined, VisibilityOff } from '@mui/icons-material'
import { BaseURLV1 } from '@/config/api'
import { LoginSchema } from '@/validations/userValidation'

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

const LoginForm = ({ setAuth }: any) => {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)

  const from = location.state?.from?.pathname || '/'

  const [showPassword, setShowPassword] = useState(false)

  const handleLoginUser = async () => {
    setIsLoading(true)
    try {
      const payload = {
        username: formik.values.username,
        password: formik.values.password,
      }

      const {
        data: { data, token, message },
      } = await axios.post(`${BaseURLV1}/auth/login`, payload)

      alert(message)
      setIsLoading(false)
      localStorage.setItem('userLogin', JSON.stringify({ ...data, token }))
      // setUser({ ...data, token })
      navigate('/')
    } catch (e: any) {
      setIsLoading(false)
      alert(e.response.data.description)
    }
  }

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: LoginSchema,
    onSubmit: handleLoginUser,
  })

  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } =
    formik

  return (
    <FormikProvider value={formik}>
      <Form autoComplete='off' noValidate onSubmit={handleSubmit}>
        <Box
          component={motion.div}
          animate={{
            transition: {
              staggerChildren: 0.55,
            },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
            }}
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
              autoComplete='current-password'
              type={showPassword ? 'text' : 'password'}
              label='Password'
              {...getFieldProps('password')}
              error={Boolean(touched.password && errors.password)}
              helperText={touched.password && errors.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton
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
            />
          </Box>

          <Box
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={animate}
          >
            <Stack
              direction='row'
              alignItems='center'
              justifyContent='flex-end'
              sx={{ my: 2 }}
            >
              <Link
                component={RouterLink}
                variant='subtitle2'
                to='/forgot-password'
                underline='hover'
                color='blue'
              >
                Forgot password?
              </Link>
            </Stack>

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
              {isSubmitting ? 'loading...' : 'Login'}
            </LoadingButton>
          </Box>
        </Box>
      </Form>
    </FormikProvider>
  )
}

export default LoginForm
