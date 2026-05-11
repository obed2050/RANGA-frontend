import { Link } from 'react-router-dom'

const NotFound = () => (
  <div className="section flex min-h-[calc(100vh-120px)] flex-col items-center justify-center py-20 text-center">
    <img src="/RANGA_LOGO-removebg-preview.png" alt="RANGA" className="mb-4 h-16 w-auto opacity-60" />
    <span className="text-7xl">🔍</span>
    <p className="page-label mt-6">404 Error</p>
    <h1 className="mt-2 text-4xl font-extrabold text-slate-900 dark:text-white">Page not found</h1>
    <p className="mt-4 max-w-md text-slate-500 dark:text-slate-400">
      The page you're looking for doesn't exist or has been moved.
    </p>
    <div className="mt-8 flex flex-wrap justify-center gap-3">
      <Link to="/home" className="btn btn-gold btn-lg">Browse Listings</Link>
      <Link to="/" className="btn btn-dark btn-lg">Go Home</Link>
    </div>
  </div>
)

export default NotFound
