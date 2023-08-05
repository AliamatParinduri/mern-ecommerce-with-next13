import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Container, Typography, Link, Box, Divider } from '@mui/material'
import styled from '@emotion/styled'

import SocialAuth from '@/components/SocialAuth'
import SignupForm from '@/components/SignupForm'
import Logo from '@/components/Logo'
import { motion } from 'framer-motion'

const ContentStyle = styled(Box)(({ theme }: any) => ({
  maxWidth: 480,
  padding: 25,
  margin: 'auto',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  background: theme.palette.secondary.main,
}))

const easing = [0.6, -0.05, 0.01, 0.99]
const fadeInUp = {
  initial: {
    y: 40,
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

const Signup = ({ setAuth }: any) => {
  return (
    <Box sx={{ height: '100vh', display: 'grid', placeItems: 'center' }}>
      <Container maxWidth='sm'>
        <ContentStyle>
          <Box textAlign='center' component={motion.div} {...fadeInUp}>
            <Logo />

            <Typography sx={{ color: 'text.secondary', mb: 5 }}>
              Enter your details below.
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

          <SignupForm setAuth={setAuth} />

          <Typography
            component={motion.p}
            {...fadeInUp}
            variant='body2'
            align='center'
            sx={{ color: 'text.secondary', mt: 2 }}
          >
            By registering, I agree to{' '}
            <Link underline='always' color='text.primary' href='#'>
              Terms of Service
            </Link>{' '}
            &{' '}
            <Link underline='always' color='text.primary' href='#'>
              Privacy Policy
            </Link>
            .
          </Typography>

          <Typography
            component={motion.p}
            {...fadeInUp}
            variant='body2'
            align='center'
            sx={{ mt: 3 }}
          >
            Have an account? &nbsp;
            <Link
              variant='subtitle2'
              component={RouterLink}
              color='#0055FF'
              underline='hover'
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

export default Signup
