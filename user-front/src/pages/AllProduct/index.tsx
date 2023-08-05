import axios from 'axios'
import { useState, useEffect } from 'react'
import {
  Box,
  FormControl,
  Grid,
  MenuItem,
  Select,
  Typography,
  useTheme,
} from '@mui/material'

import CardComponent from '@/components/Card'
import { BaseURLV1 } from '@/config/api'
import { UserState, userContextType } from '@/context/userContext'
import { tokens } from '@/theme'

const AllProduct = () => {
  const [products, setProducts] = useState([])
  const [sort, setSort] = useState('')
  const { user }: userContextType = UserState()
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)

  const getproducts = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user!.token}`,
        },
      }

      const { data } = await axios.get(`${BaseURLV1}/product`, config)

      setProducts(data.data.products)
    } catch (e: any) {
      return false
    }
  }

  useEffect(() => {
    getproducts()
  }, [user])

  return (
    <Box p={2} display='flex' flexDirection='column' gap={4}>
      <Box
        my={2}
        p={1}
        display='flex'
        justifyContent='space-between'
        alignItems='center'
        bgcolor={colors.secondary[500]}
        sx={{ borderRadius: '8px' }}
      >
        <Box display='flex' flexDirection='column'>
          <Typography component='h2'>Searching for mobile phone</Typography>
          <Typography component='small'>48 results found</Typography>
        </Box>
        <Box display='flex' justifyContent='space-between' alignItems='center'>
          Short by: &nbsp;
          <FormControl sx={{ minWidth: 120 }}>
            <Select
              value={sort}
              // onChange={handleChange}
              displayEmpty
              inputProps={{ 'aria-label': 'Without label' }}
              sx={{
                width: 150,
                height: 45,
              }}
            >
              <MenuItem value=''>
                <em>None</em>
              </MenuItem>
              <MenuItem value={10}>Price Low to High</MenuItem>
              <MenuItem value={20}>Price High to Low</MenuItem>
              <MenuItem value={30}>A to Z</MenuItem>
              <MenuItem value={30}>Z to A</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      <Box display='flex' gap={2}>
        <Box
          width={{ minWidth: '250px', maxWidth: '250px' }}
          bgcolor={colors.secondary[500]}
          p={2}
          sx={{ borderRadius: '8px' }}
        >
          Lorem ipsum dolor sit amet, consectetur adipisicing elit.
          Reprehenderit reiciendis nulla ullam quas ut quam dicta quos ea neque
          asperiores, magnam impedit fuga, velit itaque harum saepe assumenda
          odit? Cupiditate placeat sunt aliquid saepe modi consequuntur repellat
          iusto, sed accusantium minus? Inventore harum, sint necessitatibus
          labore officia repudiandae, nihil eos, ullam animi doloribus molestias
          libero exercitationem ea voluptates ipsum culpa. Distinctio voluptatum
          eligendi ea corporis delectus enim consequuntur laudantium aliquid
          amet, reiciendis molestias dolores fuga corrupti aliquam voluptas
          neque officia ratione aperiam eum modi maiores! Eius beatae nesciunt
          neque rerum necessitatibus ipsum cumque iure tempore numquam
          laudantium laboriosam iste, mollitia consectetur maxime quisquam
          aspernatur dolor dolores! Et saepe consequuntur aliquid ut culpa
          reprehenderit expedita tenetur, eligendi corrupti. Alias deleniti
          sapiente placeat, reprehenderit aperiam ullam modi earum quidem cum ut
          laboriosam pariatur amet incidunt quaerat illum dignissimos expedita
          neque quibusdam dolorum. Voluptatum cum, modi dolorem illum eveniet
          veritatis reprehenderit omnis deleniti commodi doloribus porro
          officia, numquam soluta. Eligendi, veritatis animi quaerat minima esse
          incidunt recusandae, dignissimos voluptatibus placeat amet alias
          soluta, impedit molestias officiis nulla quis expedita inventore
          consectetur omnis adipisci dolore quod eum mollitia aspernatur? Sint,
          totam! Officiis dolores nostrum optio, magni cupiditate dolorem
          temporibus labore alias aut impedit eaque.
        </Box>
        <Box
          bgcolor={colors.secondary[500]}
          p={2}
          sx={{ borderRadius: '8px' }}
          flexGrow={1}
        >
          <Grid container spacing={4}>
            {products.map((product: any) => (
              <Grid item xs={4} key={product._id}>
                <CardComponent product={product} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </Box>
  )
}

export default AllProduct
