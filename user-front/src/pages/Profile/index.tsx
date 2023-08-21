/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from 'axios'
import { useState, useEffect } from 'react'
import {
  Avatar,
  Box,
  Button,
  Grid,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  styled,
  tableCellClasses,
  useTheme,
} from '@mui/material'

import { BaseURLUsers, BaseURLV1 } from '@/config/api'
import { UserState, userContextType } from '@/context/userContext'
import { tokens } from '@/theme'
import MenuUserInfo from '@/components/MenuUserInfo'
import Loading from '@/assets/svg/Loading'
import CardComponent from '@/components/Card'
import ColorButton from '@/components/ColorButton'

const Profile = () => {
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const { user }: userContextType = UserState()
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)

  const getOrders = async () => {
    try {
      setIsLoading(true)
      const config = {
        headers: {
          Authorization: `Bearer ${user!.token}`,
        },
      }

      const { data } = await axios.get(
        `${BaseURLV1}/order?userId=${user!._id}`,
        config
      )

      setIsLoading(false)
      setOrders(data.data)
    } catch (e: any) {
      setIsLoading(false)
      return false
    }
  }

  useEffect(() => {
    getOrders()
  }, [user])

  const StyledTableCell = styled(TableCell)(({ theme: any }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.primary.main,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }))

  const StyledTableRow = styled(TableRow)(({ theme: any }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }))

  return (
    <Stack p={2} flexDirection={{ sx: 'column', lg: 'row' }} gap={2}>
      <MenuUserInfo />
      <Stack flexGrow={1}>
        <Box
          display='flex'
          justifyContent='space-between'
          mb={1}
          alignItems='center'
        >
          <Typography gutterBottom variant='h3' mb={2}>
            My Profile
          </Typography>
          <ColorButton>Edit Profile</ColorButton>
        </Box>
        <Box bgcolor={colors.secondary[500]} p={2} sx={{ borderRadius: '8px' }}>
          <Box>{isLoading && <Loading value='80' />}</Box>
          {!isLoading && orders.length <= 0 && (
            <Typography gutterBottom variant='h5'>
              No Data
            </Typography>
          )}
          {!isLoading && orders.length > 0 && (
            <Stack gap={2}>
              <Grid container spacing={4}>
                <Grid item xs={6} md={4}>
                  <Box display='flex' gap={2}>
                    <Avatar
                      alt={user!.fullName}
                      src={`${BaseURLUsers}/${user!.userPic}`}
                    />
                    <Stack>
                      <Typography variant='h6'>{user!.fullName}</Typography>
                      <Typography variant='body2'>{user!.email}</Typography>
                    </Stack>
                  </Box>
                </Grid>
              </Grid>

              <Box>
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 700 }} aria-label='customized table'>
                    <TableHead>
                      <TableRow>
                        <StyledTableCell>Full Name</StyledTableCell>
                        <StyledTableCell>Username</StyledTableCell>
                        <StyledTableCell>Email</StyledTableCell>
                        <StyledTableCell>Phone</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <StyledTableRow>
                        <StyledTableCell component='th' scope='row'>
                          {user!.fullName}
                        </StyledTableCell>
                        <StyledTableCell>{user!.username}</StyledTableCell>
                        <StyledTableCell>{user!.email}</StyledTableCell>
                        <StyledTableCell>{user!.noHP}</StyledTableCell>
                      </StyledTableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Stack>
          )}
        </Box>
      </Stack>
    </Stack>
  )
}

export default Profile
