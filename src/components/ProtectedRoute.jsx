import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const ProtectedRoute = ({ children }) => {
  const { user, role } = useAuth()

  if (!user || role !== 'seller') {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute
