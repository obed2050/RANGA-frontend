import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import toast from 'react-hot-toast'
import Sidebar from '../components/Sidebar.jsx'
import UploadForm from '../components/UploadForm.jsx'

const Upload = () => {
  const { addAd, updateAd } = useAuth()
  const location  = useLocation()
  const navigate  = useNavigate()
  const editAd    = location.state?.editAd || null

  const handleSubmit = (ad) => {
    if (editAd) {
      updateAd(ad)
      toast.success('Ad updated successfully!')
    } else {
      addAd(ad)
      toast.success('Ad published successfully!')
    }
    navigate('/my-ads')
  }

  return (
    <div className="section py-10">
      <div className="grid gap-8 xl:grid-cols-[256px_1fr]">
        <Sidebar />
        <div className="min-w-0">
          <UploadForm initialData={editAd} onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  )
}

export default Upload
