import { Link as RouterLink, useParams } from 'react-router-dom'
import { Container, Typography, Link, Box, useTheme } from '@mui/material'
import styled from '@emotion/styled'
import { motion } from 'framer-motion'

import Logo from '@/components/Logo'
import { tokens } from '@/theme'
import ResetPasswordForm from '@/components/ResetPasswordForm'

const ContentStyle = styled(Box)(({ theme }: any) => ({
  maxWidth: 480,
  padding: 25,
  margin: 'auto',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  background: theme.palette.secondary.main,
  borderRadius: '8px',
}))

const easing = [0.6, -0.05, 0.01, 0.99]
const fadeInUp = {
  initial: {
    y: 60,
    opacity: 0,
    transition: { duration: 0.6, ease: easing },
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: easing,
    },
  },
}

const ResetPassword = () => {
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)
  const { id } = useParams()

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'grid',
        placeItems: 'center',
        background: colors.primary[500],
      }}
    >
      <Container maxWidth='sm'>
        <ContentStyle>
          <Box textAlign='center' component={motion.div} {...fadeInUp}>
            <Logo />
            <Typography sx={{ color: 'text.secondary', mb: 5 }}>
              Enter your details below.
            </Typography>
          </Box>

          {id && <ResetPasswordForm id={id} />}

          <Typography
            component={motion.p}
            {...fadeInUp}
            variant='body2'
            align='center'
            sx={{ mt: 3 }}
          >
            I think, I remember my password &nbsp;
            <Link
              variant='subtitle2'
              component={RouterLink}
              underline='hover'
              color='#0055FF'
              to='/login'
            >
              Login
            </Link>
          </Typography>
        </ContentStyle>
      </Container>
    </Box>
  )
}

export default ResetPassword
