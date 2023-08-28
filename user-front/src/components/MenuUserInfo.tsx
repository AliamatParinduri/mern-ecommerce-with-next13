import { useEffect, useState } from 'react'
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  useTheme,
} from '@mui/material'

import { useLocation, useNavigate } from 'react-router-dom'
import {
  FavoriteBorderOutlined,
  PersonOutlineOutlined,
  PlaceOutlined,
  ShoppingBagOutlined,
} from '@mui/icons-material'
import { tokens } from '@/theme'

const MenuUserInfo = () => {
  const [uri, setUri] = useState('')
  const navigate = useNavigate()
  const router = useLocation()
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)

  const menus = [
    {
      title: 'Dashboard',
      child: [
        {
          title: 'Orders',
          link: '/orders',
          icon: <ShoppingBagOutlined />,
        },
        {
          title: 'Wishlist',
          link: '/wishlist',
          icon: <FavoriteBorderOutlined />,
        },
      ],
    },
    {
      title: 'Account Settings',
      child: [
        {
          title: 'Profile Info',
          link: '/profile',
          icon: <PersonOutlineOutlined />,
        },
        {
          title: 'Addresses',
          link: '/addresses',
          icon: <PlaceOutlined />,
        },
      ],
    },
  ]

  useEffect(() => {
    setUri('/' + router.pathname.split('/')[1])
  }, [])

  return (
    <Box
      minWidth={{
        xs: '100%',
        lg: '250px',
      }}
      maxWidth={{
        xs: '100%',
        lg: '250px',
      }}
      bgcolor={colors.secondary[500]}
      p={2}
      gap={3}
      sx={{ borderRadius: '8px' }}
    >
      <Stack gap={2}>
        {menus.map((menu) => (
          <List
            component='nav'
            key={menu.title}
            aria-label='main mailbox folders'
          >
            <ListItemText primary={menu.title} />
            {menu.child.map((child: any) => (
              <ListItemButton
                sx={{
                  backgroundColor: uri === child.link ? '#787eff' : 'inherit',
                  borderRadius: '8px',
                }}
                key={child.title}
                onClick={() => navigate(child.link)}
              >
                <ListItemIcon>{child.icon}</ListItemIcon>
                <ListItemText primary={child.title} />
              </ListItemButton>
            ))}
          </List>
        ))}
      </Stack>
    </Box>
  )
}

export default MenuUserInfo
