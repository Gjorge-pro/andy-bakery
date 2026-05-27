import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import Spinner from './components/Spinner'

// Lazy load all route components for code splitting
const Home = lazy(() => import('./pages/Home'))
const Products = lazy(() => import('./pages/Products'))
const CartPage = lazy(() => import('./pages/CartPage'))
const OrderPage = lazy(() => import('./pages/OrderPage'))
const OrderTracking = lazy(() => import('./pages/OrderTracking'))
const Contact = lazy(() => import('./pages/Contact'))
const About = lazy(() => import('./pages/About'))
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))
const ManageProducts = lazy(() => import('./pages/admin/ManageProducts'))
const ManageOrders = lazy(() => import('./pages/admin/ManageOrders'))
const AdminProfile = lazy(() => import('./pages/admin/AdminProfile'))

// Protected Route Component
function ProtectedRoute({ element }) {
  const { token, loading } = useAuth()
  
  if (loading) {
    return <Spinner label="Loading admin..." />
  }
  
  if (!token) {
    return <Navigate to="/admin" replace />
  }
  
  return element
}

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Suspense fallback={<Spinner label="Loading..." />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/order" element={<OrderPage />} />
            <Route path="/track" element={<OrderTracking />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<ProtectedRoute element={<AdminDashboard />} />} />
            <Route path="/admin/products" element={<ProtectedRoute element={<ManageProducts />} />} />
            <Route path="/admin/orders" element={<ProtectedRoute element={<ManageOrders />} />} />
            <Route path="/admin/profile" element={<ProtectedRoute element={<AdminProfile />} />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </CartProvider>
  )
}
