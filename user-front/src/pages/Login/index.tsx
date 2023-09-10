import { Link as RouterLink } from 'react-router-dom'
import {
  Container,
  Typography,
  Link,
  Box,
  Divider,
  useTheme,
} from '@mui/material'
import styled from '@emotion/styled'
import { motion } from 'framer-motion'

import LoginForm from '@/components/LoginForm'
import SocialAuth from '@/components/SocialAuth'
import { tokens } from '@/theme'

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

const Login = () => {
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)

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
            {/* <Logo /> */}
            <Typography sx={{ color: 'text.secondary', mb: 5 }}>
              Login to your account
            </Typography>
          </Box>

          <Box component={motion.div} {...fadeInUp}>
            <SocialAuth />
          </Box>

          <Divider sx={{ my: 3 }} component={motion.div} {...fadeInUp}>
            <Typography variant='body2' sx={{ color: 'text.secondary' }}>
              OR
            </Typography>
          </Divider>

          <LoginForm />

          <Typography
            component={motion.p}
            {...fadeInUp}
            variant='body2'
            align='center'
            sx={{ mt: 3 }}
          >
            Don’t have an account? &nbsp;
            <Link
              variant='subtitle2'
              component={RouterLink}
              underline='hover'
              color='#0055FF'
              to='/signup'
            >
              Sign up
            </Link>
          </Typography>
        </ContentStyle>
      </Container>
    </Box>
  )
}

export default Login
