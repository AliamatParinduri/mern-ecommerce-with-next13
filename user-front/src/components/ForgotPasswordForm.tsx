import axios from 'axios'
import { useFormik, Form, FormikProvider } from 'formik'
import { useNavigate } from 'react-router-dom'
import { LoadingButton } from '@mui/lab'
import { motion } from 'framer-motion'
import { Stack, Box, TextField, useTheme } from '@mui/material'

import { tokens } from '@/theme'
import { BaseURLV1 } from '@/config/api'
import { ForgotPasswordSchema } from '@/validations/userValidation'
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

const ForgotPasswordForm = () => {
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)
  const navigate = useNavigate()

  const handleForgotPassword = async () => {
    try {
      const {
        data: { message },
      } = await axios.post(`${BaseURLV1}/auth/forgotPassword`, {
        email: formik.values.email,
        from: 'user',
      })
      ToastSuccess(message)
      navigate('/login')
    } catch (e: any) {
      ToastError(e.response.data.description)
    }
  }

  const initialValues: { email: string } = {
    email: '',
  }

  const formik = useFormik({
    initialValues,
    validationSchema: ForgotPasswordSchema,
    onSubmit: handleForgotPassword,
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
              autoComplete='email'
              type='email'
              label='Email address'
              {...getFieldProps('email')}
              error={Boolean(touched.email && errors.email)}
              helperText={touched.email && errors.email}
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

export default ForgotPasswordForm
