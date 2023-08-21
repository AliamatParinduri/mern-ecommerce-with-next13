/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from 'axios'
import { useState, useEffect } from 'react'
import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  useTheme,
} from '@mui/material'

import CardComponent from '@/components/Card'
import { BaseURLV1 } from '@/config/api'
import { tokens } from '@/theme'
import { ProductsContextType, ProductsState } from '@/context/productContext'
import { formatRupiah, onlyGetNumberValue } from '@/validations/shared'
import Loading from '@/assets/svg/Loading'

const AllProduct = () => {
  const [categories, setCategories] = useState([])
  const [subCategories, setSubCategories] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [displayOrder, setDisplayOrder] = useState('')
  const [sort, setSort] = useState('')
  const [selectFilterByCategories, setSelectFilterByCategories] = useState('')
  const [selectFilterBySubCategory, setSelectFilterBySubCategory] = useState('')
  const [filterByMinPrice, setFilterByMinPrice] = useState('')
  const [filterByMaxPrice, setFilterByMaxPrice] = useState('')
  const [sortByDisplayOrder, setSortByDisplayOrder] = useState('')
  const { products, setProducts }: ProductsContextType = ProductsState()
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)

  const getCategories = async () => {
    try {
      const { data } = await axios.get(`${BaseURLV1}/category`)

      setCategories(data.data)
    } catch (e: any) {
      return false
    }
  }

  const getParams = async ({
    categories = selectFilterByCategories,
    subCategory = selectFilterBySubCategory,
    minPrice = onlyGetNumberValue(filterByMinPrice),
    maxPrice = onlyGetNumberValue(filterByMaxPrice),
    displayOrder = sortByDisplayOrder,
  }: {
    categories?: string
    subCategory?: string
    minPrice?: number
    maxPrice?: number
    displayOrder?: string
  }) => {
    let sort = ''

    if (minPrice >= 0 && maxPrice > 0) {
      sort = 'price=' + minPrice + '-' + maxPrice
    }

    if (categories !== '') {
      if (sort === '') {
        sort = 'categories=' + categories
      } else {
        sort = sort!.concat('&categories=' + categories)
      }
    }

    if (
      subCategory !== '' &&
      categories !== '' &&
      categories.split('-').length === 1
    ) {
      if (sort === '') {
        sort = 'subCategory=' + subCategory
      } else {
        sort = sort!.concat('&subCategory=' + subCategory)
      }
    }

    if (displayOrder !== '') {
      if (sort === '') {
        sort = 'displayOrder=' + displayOrder
      } else {
        sort = sort!.concat('&displayOrder=' + displayOrder)
      }
    }

    setSort(sort)
  }

  const getProducts = async () => {
    try {
      console.log('lewat')

      setIsLoading(true)

      const { data } = await axios.get(
        `${BaseURLV1}/product${sort !== '' ? `?${sort}` : ''}`
      )

      setIsLoading(false)
      setProducts(data.data.products)
    } catch (e: any) {
      setIsLoading(false)
      return false
    }
  }

  const handleFilterByCategories = async (e: any) => {
    const checked = e.target.checked
    const value = e.target.value
    let FilterByCategories: string

    if (checked) {
      if (selectFilterByCategories == '') {
        setSelectFilterByCategories(value)
        FilterByCategories = value
      } else {
        setSelectFilterByCategories(
          selectFilterByCategories.concat(`-${value}`)
        )
        FilterByCategories = selectFilterByCategories.concat(`-${value}`)
      }
    } else {
      const categoriesSplit = selectFilterByCategories.split('-')
      const categoriesArray = categoriesSplit.filter(
        (category) => category !== value
      )
      const newCategories = categoriesArray.join('-')
      setSelectFilterByCategories(newCategories)
      FilterByCategories = newCategories
    }

    if (
      FilterByCategories !== '' &&
      FilterByCategories.split('-').length === 1
    ) {
      const subCategories: any = categories.find(
        (category: any) => category._id === FilterByCategories
      )

      if (subCategories) {
        setSubCategories(subCategories.subCategory)
      }
    }
    getParams({
      categories: FilterByCategories,
    })
  }

  const handleFilterBySubCategories = (e: any) => {
    setSelectFilterBySubCategory(e.target.value)

    getParams({
      subCategory: e.target.value,
    })
  }

  const handleFilterByPrice = (e: any, setNum: any) => {
    const newValue = onlyGetNumberValue(e.target.value)

    getParams({
      minPrice:
        setNum === setFilterByMinPrice
          ? newValue
          : onlyGetNumberValue(filterByMinPrice),
      maxPrice:
        setNum === setFilterByMaxPrice
          ? newValue
          : onlyGetNumberValue(filterByMaxPrice),
    })

    setNum(formatRupiah(newValue.toString(), 'Rp. '))
  }

  const handlesortByDisplayOrder = (e: any) => {
    setDisplayOrder(e.target.value)
    setSortByDisplayOrder(e.target.value)

    getParams({
      displayOrder: e.target.value,
    })
  }

  useEffect(() => {
    getCategories()
  }, [])

  useEffect(() => {
    getProducts()
  }, [sort])

  return (
    <Box p={2} display='flex' flexDirection='column' gap={2}>
      <Box
        mt={1}
        mb={2}
        p={1}
        display='flex'
        justifyContent='space-between'
        alignItems='center'
        bgcolor={colors.secondary[500]}
        sx={{ borderRadius: '8px' }}
      >
        <Box display='flex' flexDirection='column'>
          <Typography component='h2'>Searching for mobile phone</Typography>
          <Typography component='small'>
            {products.length} results found
          </Typography>
        </Box>
        {selectFilterByCategories !== '' &&
          selectFilterByCategories.split('-').length === 1 && (
            <Box
              display='flex'
              justifyContent='space-between'
              alignItems='center'
            >
              Sub Category: &nbsp;
              <FormControl sx={{ minWidth: 120 }}>
                <Select
                  value={selectFilterBySubCategory}
                  onChange={handleFilterBySubCategories}
                  displayEmpty
                  inputProps={{ 'aria-label': 'Without label' }}
                  sx={{
                    width: 150,
                    height: 45,
                  }}
                >
                  <MenuItem value='' selected>
                    <em>None</em>
                  </MenuItem>
                  {subCategories.length > 0 &&
                    subCategories.map((sc) => (
                      <MenuItem value={sc} key={sc}>
                        {sc}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Box>
          )}
        <Box display='flex' justifyContent='space-between' alignItems='center'>
          Sort by: &nbsp;
          <FormControl sx={{ minWidth: 120 }}>
            <Select
              value={displayOrder}
              onChange={handlesortByDisplayOrder}
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
              <MenuItem value='A-Z'>A to Z</MenuItem>
              <MenuItem value='Z-A'>Z to A</MenuItem>
              <MenuItem value='Low-High'>Price Low to High</MenuItem>
              <MenuItem value='High-Low'>Price High to Low</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      <Box display='flex' gap={2}>
        <Stack
          width={{ minWidth: '250px', maxWidth: '250px' }}
          bgcolor={colors.secondary[500]}
          p={2}
          gap={3}
          sx={{ borderRadius: '8px' }}
        >
          <Box>
            <Typography variant='h5'>Categories:</Typography>
            {isLoading && <Loading value='80' />}
            {!isLoading && categories.length <= 0 && (
              <Typography gutterBottom variant='h6' mt={2}>
                No Categories
              </Typography>
            )}
            {!isLoading && categories.length > 0 && (
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      defaultChecked
                      sx={{
                        color: '#787eff',
                        '&.Mui-checked': {
                          color: '#787eff',
                        },
                      }}
                    />
                  }
                  label='All'
                />
                {categories.map((category: any) => (
                  <FormControlLabel
                    key={category._id}
                    control={
                      <Checkbox
                        value={category._id}
                        sx={{
                          color: '#787eff',
                          '&.Mui-checked': {
                            color: '#787eff',
                          },
                        }}
                        onChange={handleFilterByCategories}
                      />
                    }
                    label={category.category}
                  />
                ))}
              </FormGroup>
            )}
          </Box>
          <Stack gap={2}>
            <Typography variant='h5'>Price:</Typography>
            <Box>
              <TextField
                fullWidth
                autoComplete='Min Price'
                type='text'
                label='Min Price'
                value={filterByMinPrice}
                onChange={(e) => handleFilterByPrice(e, setFilterByMinPrice)}
              />
            </Box>
            <Box>
              <TextField
                fullWidth
                autoComplete='Max Price'
                type='text'
                label='Max Price'
                value={filterByMaxPrice}
                onChange={(e) => handleFilterByPrice(e, setFilterByMaxPrice)}
              />
            </Box>
          </Stack>
          {/* <Box>
            <Typography variant='h5'>Ratings:</Typography>
          </Box> */}
        </Stack>
        <Box
          bgcolor={colors.secondary[500]}
          p={2}
          sx={{ borderRadius: '8px' }}
          flexGrow={1}
        >
          <Box>{isLoading && <Loading value='80' />}</Box>
          {!isLoading && products.length <= 0 && (
            <Typography gutterBottom variant='subtitle1'>
              No Data
            </Typography>
          )}
          {!isLoading && products.length > 0 && (
            <Grid container spacing={4}>
              {products.map((product: any) => (
                <Grid item sm={12} md={6} lg={4} xl={3} key={product._id}>
                  <CardComponent product={product} />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default AllProduct
