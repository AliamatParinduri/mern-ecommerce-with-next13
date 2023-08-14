import { MouseEvent, useContext, useState } from 'react'
import { AppBar } from '@mui/material'
import Badge from '@mui/material/Badge'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Menu from '@mui/material/Menu'
import MenuIcon from '@mui/icons-material/Menu'
import Container from '@mui/material/Container'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import MenuItem from '@mui/material/MenuItem'
import AdbIcon from '@mui/icons-material/Adb'
import {
  DarkModeOutlined,
  LightModeOutlined,
  ShoppingBagOutlined,
  SearchOutlined,
} from '@mui/icons-material'
import { useTheme } from '@mui/material'
import { ColorModeContext, tokens } from '@/theme'
import { UserState, userContextType } from '@/context/userContext'
import { useNavigate } from 'react-router-dom'

const pages = [
  { title: 'Home', link: '/dashboard' },
  { title: 'All Product', link: '/all-product' },
  { title: 'My Orders', link: '/orders' },
]
const settings = ['Profile', 'Logout']

const Navbar = () => {
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)
  const colorMode = useContext(ColorModeContext)
  const navigate = useNavigate()
  const { user }: userContextType = UserState()

  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null)
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null)

  const handleOpenNavMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget)
  }
  const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget)
  }

  const handleCloseNavMenu = () => {
    setAnchorElNav(null)
  }

  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }

  return (
    <AppBar position='static'>
      <Container maxWidth='xl'>
        <Toolbar
          disableGutters
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Box display='flex'>
            <AdbIcon
              sx={{
                display: { xs: `${!user ? 'flex' : 'none'}`, sm: 'flex' },
                mr: 1,
              }}
            />
            <Typography
              variant='h6'
              noWrap
              component='a'
              onClick={() => navigate('/dashboard')}
              sx={{
                mr: 2,
                display: { xs: `${!user ? 'flex' : 'none'}`, sm: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
                cursor: 'pointer',
              }}
            >
              E-Commerce
            </Typography>

            {user && (
              <Box sx={{ flexGrow: 1, display: { xs: 'flex', sm: 'none' } }}>
                <IconButton
                  size='large'
                  aria-label='account of current user'
                  aria-controls='menu-appbar'
                  aria-haspopup='true'
                  onClick={handleOpenNavMenu}
                  color='inherit'
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  id='menu-appbar'
                  anchorEl={anchorElNav}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                  open={Boolean(anchorElNav)}
                  onClose={handleCloseNavMenu}
                  sx={{
                    display: { xs: 'block', sm: 'none' },
                  }}
                >
                  {pages.map((page) => (
                    <MenuItem key={page.link} onClick={handleCloseNavMenu}>
                      <Typography textAlign='center'>{'page'}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
            )}
          </Box>

          {user && (
            <Box
              sx={{ flexGrow: 1, display: { xs: 'none', sm: 'flex' } }}
              justifyContent='center'
            >
              {pages.map((page) => (
                <Button
                  key={page.link}
                  onClick={() => navigate(page.link)}
                  sx={{ my: 2, color: 'white' }}
                >
                  {page.title}
                </Button>
              ))}
            </Box>
          )}

          <Box display='flex' gap={2}>
            <Box display='flex'>
              <IconButton>
                <SearchOutlined />
              </IconButton>
              <IconButton onClick={colorMode.toggleColorMode}>
                {theme.palette.mode === 'dark' ? (
                  <DarkModeOutlined />
                ) : (
                  <LightModeOutlined />
                )}
              </IconButton>
              {user && (
                <IconButton onClick={() => navigate('/cart')}>
                  <Badge
                    badgeContent={user ? user!.cart.length : 0}
                    color='error'
                    sx={{ borderRadius: '100%' }}
                  >
                    <ShoppingBagOutlined />
                  </Badge>
                </IconButton>
              )}
            </Box>

            {user && (
              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title='Open settings'>
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar
                      alt='Remy Sharp'
                      src='/static/images/avatar/2.jpg'
                    />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id='menu-appbar'
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {settings.map((setting) => (
                    <MenuItem key={setting} onClick={handleCloseUserMenu}>
                      <Typography textAlign='center'>{setting}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default Navbar
