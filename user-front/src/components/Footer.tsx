import { styled, Typography, useTheme } from '@mui/material'
import { Box, Container } from '@mui/system'

import { Twitter, Facebook, LinkedIn } from '@mui/icons-material'
import { tokens } from '@/theme'

const Footer = () => {
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)

  const CustomContainer = styled(Container)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-around',
    gap: theme.spacing(5),
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      textAlign: 'center',
    },
  }))

  const IconBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    [theme.breakpoints.down('sm')]: {
      justifyContent: 'center',
    },
  }))

  const FooterLink = styled('span')(({ theme }) => ({
    fontSize: '16px',
    fontWeight: '300',
    cursor: 'pointer',
    '&:hover': {},
  }))

  return (
    <Box sx={{ py: 10 }} bgcolor={colors.secondary[500]}>
      <CustomContainer>
        <Box>
          <Typography
            sx={{
              fontSize: '20px',
              fontWeight: '700',
              mb: 2,
            }}
          >
            Products
          </Typography>

          <FooterLink>Listing</FooterLink>
          <br />
          <FooterLink>Properties</FooterLink>
          <br />
          <FooterLink>Agents</FooterLink>
          <br />
          <FooterLink>Blog</FooterLink>
          <br />
        </Box>

        <Box>
          <Typography
            sx={{
              fontSize: '20px',
              fontWeight: '700',
              mb: 2,
            }}
          >
            Resource
          </Typography>

          <FooterLink>Our Homes</FooterLink>
          <br />
          <FooterLink>Stories</FooterLink>
          <br />
          <FooterLink>Video</FooterLink>
          <br />
          <FooterLink>Free Trial</FooterLink>
          <br />
        </Box>

        <Box>
          <Typography
            sx={{
              fontSize: '20px',
              fontWeight: '700',
              mb: 2,
            }}
          >
            Get in touch
          </Typography>

          <Typography
            sx={{
              fontSize: '16px',
              fontWeight: '500',
              mb: 2,
            }}
          >
            You'll find your next home, in any style you prefer
          </Typography>

          <IconBox>
            <Facebook sx={{ cursor: 'pointer' }} />
            <Twitter sx={{ cursor: 'pointer' }} />
            <LinkedIn sx={{ cursor: 'pointer' }} />
          </IconBox>
        </Box>
      </CustomContainer>
    </Box>
  )
}

export default Footer
