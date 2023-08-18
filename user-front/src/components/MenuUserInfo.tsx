import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
} from '@mui/material'

import { useNavigate } from 'react-router-dom'
import {
  FavoriteBorderOutlined,
  PersonOutlineOutlined,
  PlaceOutlined,
  ShoppingBagOutlined,
} from '@mui/icons-material'

const MenuUserInfo = () => {
  const navigate = useNavigate()

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

  return (
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
  )
}

export default MenuUserInfo
