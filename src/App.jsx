import { Route, Routes, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Landing from './pages/Landing.jsx'
import Home from './pages/Home.jsx'
import ProductDetails from './pages/ProductDetails.jsx'
import SellerLanding from './pages/SellerLanding.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Dashboard from './pages/Dashboard.jsx'
import MyAds from './pages/MyAds.jsx'
import Upload from './pages/Upload.jsx'
import Profile from './pages/Profile.jsx'
import Admin from './pages/Admin.jsx'
import NotFound from './pages/NotFound.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import AdminRoute from './components/AdminRoute.jsx'

const ScrollToTop = () => {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }) }, [pathname])
  return null
}

const Layout = ({ children }) => {
  const { pathname } = useLocation()
  const isAdmin = pathname === '/admin'
  if (isAdmin) return children
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 dark:bg-[#0d0f14] dark:text-slate-100">
      <Navbar />
      <main className="flex-1 pt-16">{children}</main>
      <Footer />
    </div>
  )
}

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/"               element={<Layout><Landing /></Layout>} />
        <Route path="/home"           element={<Layout><Home /></Layout>} />
        <Route path="/product/:id"    element={<Layout><ProductDetails /></Layout>} />
        <Route path="/seller-landing" element={<Layout><SellerLanding /></Layout>} />
        <Route path="/login"          element={<Layout><Login /></Layout>} />
        <Route path="/register"       element={<Layout><Register /></Layout>} />
        <Route path="/dashboard"      element={<Layout><ProtectedRoute><Dashboard /></ProtectedRoute></Layout>} />
        <Route path="/my-ads"         element={<Layout><ProtectedRoute><MyAds /></ProtectedRoute></Layout>} />
        <Route path="/upload"         element={<Layout><ProtectedRoute><Upload /></ProtectedRoute></Layout>} />
        <Route path="/profile"        element={<Layout><ProtectedRoute><Profile /></ProtectedRoute></Layout>} />
        <Route path="/admin"          element={<AdminRoute><Admin /></AdminRoute>} />
        <Route path="/404"            element={<Layout><NotFound /></Layout>} />
        <Route path="*"               element={<Layout><NotFound /></Layout>} />
      </Routes>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            borderRadius: '12px',
            background: 'var(--toast-bg, #1e293b)',
            color: '#f1f5f9',
            fontSize: '14px',
          },
          success: { iconTheme: { primary: '#f59e0b', secondary: '#0f172a' } },
        }}
      />
    </>
  )
}

export default App
