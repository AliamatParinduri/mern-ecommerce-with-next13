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
import { ToastError } from '@/components/Toast'
import { Star } from '@mui/icons-material'

const AllProduct = () => {
  const [categories, setCategories] = useState([])
  const [subCategories, setSubCategories] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingCategories, setIsLoadingCategories] = useState(false)
  const [checkedAllProduct, setCheckedAllProduct] = useState(true)
  const [checkedCategories, setCheckedCategories] = useState<string[]>([])
  const [displayOrder, setDisplayOrder] = useState('')
  const [sort, setSort] = useState('')
  const [selectFilterByCategories, setSelectFilterByCategories] = useState('')
  const [selectFilterBySubCategory, setSelectFilterBySubCategory] = useState('')
  const [selectFilterByRating, setSelectFilterByRating] = useState('')
  const [filterByMinPrice, setFilterByMinPrice] = useState('')
  const [filterByMaxPrice, setFilterByMaxPrice] = useState('')
  const [sortByDisplayOrder, setSortByDisplayOrder] = useState('')
  const { products, setProducts }: ProductsContextType = ProductsState()
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)

  const getCategories = async () => {
    try {
      setIsLoadingCategories(true)
      const { data } = await axios.get(`${BaseURLV1}/category`)

      setCategories(data.data)
      setIsLoadingCategories(false)
    } catch (e: any) {
      setIsLoadingCategories(false)
      const description = e.response?.data?.description
      ToastError(description ? description : 'Failed get Categories Data')
      return false
    }
  }

  const getParams = async ({
    filterByCategories = selectFilterByCategories,
    filterBySubCategory = selectFilterBySubCategory,
    minPrice = onlyGetNumberValue(filterByMinPrice),
    maxPrice = onlyGetNumberValue(filterByMaxPrice),
    displayOrder = sortByDisplayOrder,
    rating = selectFilterByRating,
  }: {
    filterByCategories?: string
    filterBySubCategory?: string
    minPrice?: number
    maxPrice?: number
    displayOrder?: string
    rating?: string
  }) => {
    let sort = ''

    if (minPrice >= 0 && maxPrice > 0) {
      sort = 'price=' + minPrice + '-' + maxPrice
    }

    if (filterByCategories !== '') {
      if (sort === '') {
        sort = 'categories=' + filterByCategories
      } else {
        sort = sort!.concat('&categories=' + filterByCategories)
      }
    }

    if (
      filterBySubCategory !== '' &&
      filterByCategories !== '' &&
      filterByCategories.split('-').length === 1
    ) {
      if (sort === '') {
        sort = 'subCategory=' + filterBySubCategory
      } else {
        sort = sort!.concat('&subCategory=' + filterBySubCategory)
      }
    }

    if (displayOrder !== '') {
      if (sort === '') {
        sort = 'displayOrder=' + displayOrder
      } else {
        sort = sort!.concat('&displayOrder=' + displayOrder)
      }
    }

    if (rating !== '') {
      if (sort === '') {
        sort = 'rating=' + rating
      } else {
        sort = sort!.concat('&rating=' + rating)
      }
    }

    setSort(sort)
  }

  const getProducts = async () => {
    try {
      setIsLoading(true)

      const { data } = await axios.get(
        `${BaseURLV1}/product${sort !== '' ? `?${sort}` : ''}`
      )

      setIsLoading(false)
      setProducts(data.data.products)
    } catch (e: any) {
      setIsLoading(false)
      const description = e.response?.data?.description
      ToastError(description ? description : 'Failed get Products Data')
      return false
    }
  }

  const handleFilterByCategories = async (e: any) => {
    const checked = e.target.checked
    const value = e.target.value
    const name = e.target.name
    let FilterByCategories: string

    if (name === 'all') {
      setCheckedAllProduct((prev) => !prev)
      setCheckedCategories([])

      setSelectFilterByCategories('')
      setSelectFilterBySubCategory('')

      getParams({
        filterByCategories: '',
        filterBySubCategory: '',
      })
    } else {
      const check = checkedCategories.includes(name)
      let newCheck = []
      if (check) {
        newCheck = checkedCategories.filter(
          (category: string) => category !== name
        )
      } else {
        newCheck = [...checkedCategories, name]
      }

      if (newCheck.length === 0 || checkedCategories.length === 0) {
        setCheckedAllProduct((prev) => !prev)
      }

      setCheckedCategories(newCheck)

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
        filterByCategories: FilterByCategories,
      })

      if (newCheck.length === 0 || newCheck.length > 1) {
        setSelectFilterBySubCategory('')
      }
    }
  }

  const handleFilterBySubCategories = (e: any) => {
    setSelectFilterBySubCategory(e.target.value)

    getParams({
      filterBySubCategory: e.target.value,
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

  const handleSortByDisplayOrder = (e: any) => {
    setDisplayOrder(e.target.value)
    setSortByDisplayOrder(e.target.value)

    getParams({
      displayOrder: e.target.value,
    })
  }

  const handleRatingProduct = (e: any) => {
    const newValue = e.target.value

    setSelectFilterByRating(newValue)

    getParams({ rating: newValue })
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
        p={1}
        display='flex'
        justifyContent='space-between'
        alignItems={{ xs: 'start', md: 'center' }}
        bgcolor={colors.secondary[500]}
        sx={{ borderRadius: '8px' }}
        flexDirection={{ xs: 'column', md: 'row' }}
        gap={2}
      >
        <Box display='flex' flexDirection='column'>
          <Typography component='h2'>Searching for all products</Typography>
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
                    All
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
              onChange={handleSortByDisplayOrder}
              displayEmpty
              inputProps={{ 'aria-label': 'Without label' }}
              sx={{
                width: 150,
                height: 45,
              }}
            >
              <MenuItem value=''>Default</MenuItem>
              <MenuItem value='A-Z'>A to Z</MenuItem>
              <MenuItem value='Z-A'>Z to A</MenuItem>
              <MenuItem value='Low-High'>Price Low to High</MenuItem>
              <MenuItem value='High-Low'>Price High to Low</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      <Box display='flex' flexDirection={{ xs: 'column', md: 'row' }} gap={2}>
        <Stack
          maxWidth={{
            xs: '100%',
            md: '250px',
          }}
          minWidth={{
            xs: '100%',
            md: '250px',
          }}
          bgcolor={colors.secondary[500]}
          p={2}
          gap={3}
          sx={{ borderRadius: '8px' }}
        >
          <Box>
            <Typography variant='h5'>Categories:</Typography>
            {isLoadingCategories && <Loading value='80' />}
            {!isLoadingCategories && categories.length <= 0 && (
              <Typography gutterBottom variant='h6' mt={2}>
                No Categories
              </Typography>
            )}
            {!isLoadingCategories && categories.length > 0 && (
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      onChange={handleFilterByCategories}
                      disabled={checkedAllProduct}
                      name='all'
                      checked={checkedAllProduct}
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
                    checked={checkedCategories.includes(category.category)}
                    control={
                      <Checkbox
                        value={category._id}
                        name={category.category}
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
          <Stack gap={1}>
            <Typography variant='h5'>Ratings (Above):</Typography>
            {[5, 4, 3, 2, 1].map((i) => (
              <Box
                display='flex'
                justifyItems='center'
                alignItems='center'
                gap={0.3}
                key={i}
              >
                <input
                  type='radio'
                  name='rating'
                  value={i}
                  onChange={handleRatingProduct}
                />
                <Star sx={{ color: '#FAAF00' }} />
                <Typography>{i}</Typography>
              </Box>
            ))}
            <Box display='flex' gap={1}>
              <input
                type='radio'
                name='rating'
                value=''
                onChange={handleRatingProduct}
                defaultChecked={true}
              />
              <Typography>All Rating</Typography>
            </Box>
          </Stack>
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
