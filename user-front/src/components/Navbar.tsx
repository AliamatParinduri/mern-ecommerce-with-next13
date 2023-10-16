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
  Login,
} from '@mui/icons-material'
import { useTheme } from '@mui/material'
import { ColorModeContext } from '@/theme'
import { UserState, userContextType } from '@/context/userContext'
import { useNavigate } from 'react-router-dom'
import { BaseURLUsers } from '@/config/api'
import { ToastSuccess } from './Toast'

const pages = [
  { title: 'Home', link: '/dashboard', auth: false },
  { title: 'All Product', link: '/all-product', auth: false },
  { title: 'My Orders', link: '/orders', auth: true },
]
const settings = [
  { title: 'Profile', link: '/profile' },
  { title: 'Logout', link: '/logout' },
]

const Navbar = () => {
  const theme = useTheme()
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

  const logoutHandler = () => {
    localStorage.removeItem('userInfo')
    ToastSuccess('logout success')
    navigate('/login')
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
          <Box display='flex' alignItems='center'>
            <AdbIcon
              sx={{
                display: { xs: 'none', md: 'flex' },
                mr: 1,
              }}
            />

            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
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
                onClose={handleCloseNavMenu}
                open={Boolean(anchorElNav)}
                sx={{
                  display: { xs: 'block', md: 'none' },
                }}
              >
                {pages.map((page) => {
                  const menuItem = (
                    <MenuItem onClick={() => navigate(page.link)}>
                      <Typography textAlign='center'>{page.title}</Typography>
                    </MenuItem>
                  )
                  return (
                    <Box key={page.link}>
                      {!page.auth && menuItem}
                      {user && page.auth && menuItem}
                    </Box>
                  )
                })}
              </Menu>
            </Box>
            <Typography
              variant='h6'
              noWrap
              component='a'
              onClick={() => navigate('/dashboard')}
              sx={{
                mr: 2,
                display: 'flex',
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
          </Box>

          <Box
            sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}
            justifyContent='center'
          >
            {pages.map((page) => {
              const btn = (
                <Button
                  onClick={() => navigate(page.link)}
                  sx={{
                    my: 2,
                    color: 'inherit',
                  }}
                >
                  {page.title}
                </Button>
              )
              return (
                <Box key={page.link}>
                  {!page.auth && btn}
                  {user && page.auth && btn}
                </Box>
              )
            })}
          </Box>

          <Box display='flex' gap={2}>
            <Box display='flex'>
              <IconButton>
                <SearchOutlined />
              </IconButton>
              <IconButton onClick={colorMode.toggleColorMode}>
                {theme.palette.mode === 'dark' ? (
                  <LightModeOutlined />
                ) : (
                  <DarkModeOutlined />
                )}
              </IconButton>
              {!user && (
                <IconButton onClick={() => navigate('/login')}>
                  <Login />
                </IconButton>
              )}
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
                      alt={user.fullName}
                      src={`${BaseURLUsers}/${user.userPic}`}
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
                    <MenuItem
                      key={setting.title}
                      onClick={() => {
                        return setting.link === '/logout'
                          ? logoutHandler()
                          : navigate(setting.link)
                      }}
                    >
                      <Typography textAlign='center'>
                        {setting.title}
                      </Typography>
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
