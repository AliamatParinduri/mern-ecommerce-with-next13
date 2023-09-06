import 'react-toastify/dist/ReactToastify.css'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { ColorModeContext, useMode } from './theme'
import { Navigate, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Layout from './pages/Layout'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Signup from './pages/Signup'
import AllProduct from './pages/AllProduct'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Cart from './pages/Cart'
import ProductDetails from './pages/ProductDetails'
import Orders from './pages/Order'
import OrderDetail from './pages/OrderDetail'
import Wishlist from './pages/Wishlist'
import Profile from './pages/Profile'
import Addresses from './pages/Addresses'
import CreateAddress from './pages/Addresses/create'
import EditAddress from './pages/Addresses/edit'
import EditProfile from './pages/EditProfile'

function App() {
  const [theme, colorMode]: any = useMode()

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className='app'>
          <Routes>
            <Route element={<Layout />}>
              <Route path='/' element={<Navigate to='/dashboard' replace />} />
              <Route path='/dashboard' element={<Dashboard />} />
              <Route path='/all-product' element={<AllProduct />} />
              <Route path='/product/:id/details' element={<ProductDetails />} />
              <Route path='/cart' element={<Cart />} />
              <Route path='/orders' element={<Orders />} />
              <Route path='/orders/:id' element={<OrderDetail />} />
              <Route path='/wishlist' element={<Wishlist />} />
              <Route path='/profile' element={<Profile />} />
              <Route path='/profile/edit-profile' element={<EditProfile />} />
              <Route path='/addresses' element={<Addresses />} />
              <Route path='/addresses/create' element={<CreateAddress />} />
              <Route path='/addresses/:id/edit' element={<EditAddress />} />
            </Route>
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<Signup />} />
            <Route path='/forgot-password' element={<ForgotPassword />} />
            <Route path='/reset-password/:id' element={<ResetPassword />} />
          </Routes>
        </div>
      </ThemeProvider>
      <ToastContainer
        position='top-right'
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </ColorModeContext.Provider>
  )
}

export default App
