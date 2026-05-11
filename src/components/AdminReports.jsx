import { useState } from 'react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext.jsx'

const AdminReports = () => {
  const { getSystemStats, ads, getAllUsers } = useAuth()
  const stats = getSystemStats()
  const [selectedReport, setSelectedReport] = useState('overview')

  const handleExportReport = (format) => {
    toast.success(`Report exported as ${format}`)
  }

  const ReportCard = ({ title, description, icon, onClick }) => (
    <button
      onClick={onClick}
      className="rounded-[20px] border border-slate-800/80 bg-slate-900/70 p-6 text-left shadow-soft transition hover:border-emerald-500/40 hover:bg-slate-900"
    >
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="font-semibold text-white">{title}</h3>
      <p className="mt-1 text-sm text-slate-400">{description}</p>
    </button>
  )

  return (
    <section className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-white">Reports & Analytics</h2>
        <p className="mt-2 text-slate-400">Generate and export system reports</p>
      </div>

      {/* Report Selection */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <ReportCard
          title="System Overview"
          description="Complete system statistics and metrics"
          icon="📊"
          onClick={() => setSelectedReport('overview')}
        />
        <ReportCard
          title="User Analytics"
          description="User growth, roles, and engagement"
          icon="👥"
          onClick={() => setSelectedReport('users')}
        />
        <ReportCard
          title="Ad Performance"
          description="Ad trends, categories, and activity"
          icon="📈"
          onClick={() => setSelectedReport('ads')}
        />
        <ReportCard
          title="Category Report"
          description="Category-wise ad distribution"
          icon="📂"
          onClick={() => setSelectedReport('categories')}
        />
        <ReportCard
          title="Activity Report"
          description="System activity and admin actions"
          icon="🔍"
          onClick={() => setSelectedReport('activity')}
        />
        <ReportCard
          title="Security Report"
          description="Security events and access logs"
          icon="🔒"
          onClick={() => setSelectedReport('security')}
        />
      </div>

      {/* Report Content */}
      <div className="rounded-[20px] border border-slate-800/80 bg-slate-900/70 p-8 shadow-soft">
        {selectedReport === 'overview' && (
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-white">System Overview Report</h3>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg bg-slate-950/50 p-4">
                <p className="text-sm text-slate-500">Total Users</p>
                <p className="mt-2 text-3xl font-bold text-emerald-300">{stats.totalUsers}</p>
                <p className="mt-1 text-xs text-slate-600">↑ 12% from last month</p>
              </div>
              <div className="rounded-lg bg-slate-950/50 p-4">
                <p className="text-sm text-slate-500">Total Ads</p>
                <p className="mt-2 text-3xl font-bold text-blue-300">{stats.totalAds}</p>
                <p className="mt-1 text-xs text-slate-600">↑ 8% from last month</p>
              </div>
              <div className="rounded-lg bg-slate-950/50 p-4">
                <p className="text-sm text-slate-500">Seller Ratio</p>
                <p className="mt-2 text-3xl font-bold text-purple-300">
                  {((stats.totalSellers / stats.totalUsers) * 100 || 0).toFixed(1)}%
                </p>
                <p className="mt-1 text-xs text-slate-600">Of total users</p>
              </div>
              <div className="rounded-lg bg-slate-950/50 p-4">
                <p className="text-sm text-slate-500">Categories</p>
                <p className="mt-2 text-3xl font-bold text-yellow-300">{stats.totalCategories}</p>
                <p className="mt-1 text-xs text-slate-600">Active categories</p>
              </div>
            </div>
          </div>
        )}

        {selectedReport === 'users' && (
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-white">User Analytics Report</h3>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-lg bg-slate-950/50 p-4">
                <p className="text-sm text-slate-500">Total Buyers</p>
                <p className="mt-2 text-3xl font-bold text-purple-300">{stats.totalBuyers}</p>
              </div>
              <div className="rounded-lg bg-slate-950/50 p-4">
                <p className="text-sm text-slate-500">Total Sellers</p>
                <p className="mt-2 text-3xl font-bold text-blue-300">{stats.totalSellers}</p>
              </div>
              <div className="rounded-lg bg-slate-950/50 p-4">
                <p className="text-sm text-slate-500">Avg Ads/Seller</p>
                <p className="mt-2 text-3xl font-bold text-emerald-300">
                  {(stats.totalAds / stats.totalSellers || 0).toFixed(1)}
                </p>
              </div>
            </div>

            <div className="rounded-lg bg-slate-950/50 p-4">
              <p className="mb-3 text-sm font-semibold text-slate-300">User Growth Projection</p>
              <div className="flex items-end gap-2 h-40">
                {[45, 52, 48, 61, 70, 68, 75, 82, 78, 85, 92, 98].map((height, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t bg-emerald-500/60"
                    style={{ height: `${(height / 100) * 100}%` }}
                    title={`Month ${i + 1}`}
                  />
                ))}
              </div>
              <p className="mt-2 text-xs text-slate-500">12-month projection</p>
            </div>
          </div>
        )}

        {selectedReport === 'ads' && (
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-white">Ad Performance Report</h3>

            <div className="rounded-lg bg-slate-950/50 p-4">
              <p className="mb-4 text-sm font-semibold text-slate-300">Ads by Category</p>
              <div className="space-y-3">
                {['Services', 'Products', 'Electronics', 'Fashion', 'Other'].map((cat, i) => {
                  const width = [45, 30, 15, 8, 2][i]
                  return (
                    <div key={cat}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-300">{cat}</span>
                        <span className="text-emerald-300">{Math.round((width / 100) * stats.totalAds)} ads</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-800">
                        <div className="h-2 rounded-full bg-emerald-500" style={{ width: `${width}%` }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {selectedReport === 'categories' && (
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-white">Category Distribution Report</h3>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg bg-slate-950/50 p-4">
                <p className="mb-3 text-sm font-semibold text-slate-300">Category List</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-slate-300">
                    <span>Services</span>
                    <span>150 ads</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Products</span>
                    <span>100 ads</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Electronics</span>
                    <span>50 ads</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Fashion</span>
                    <span>27 ads</span>
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-slate-950/50 p-4">
                <p className="mb-3 text-sm font-semibold text-slate-300">Pie Chart (Distribution)</p>
                <div className="flex h-40 items-center justify-center">
                  <div className="text-center">
                    <p className="text-4xl">📊</p>
                    <p className="mt-2 text-xs text-slate-500">{stats.totalCategories} categories</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedReport === 'activity' && (
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-white">Activity Report</h3>

            <div className="grid gap-4 md:grid-cols-4">
              <div className="rounded-lg bg-slate-950/50 p-4">
                <p className="text-sm text-slate-500">Total Actions</p>
                <p className="mt-2 text-3xl font-bold text-emerald-300">1,234</p>
              </div>
              <div className="rounded-lg bg-slate-950/50 p-4">
                <p className="text-sm text-slate-500">User Actions</p>
                <p className="mt-2 text-3xl font-bold text-blue-300">892</p>
              </div>
              <div className="rounded-lg bg-slate-950/50 p-4">
                <p className="text-sm text-slate-500">Admin Actions</p>
                <p className="mt-2 text-3xl font-bold text-purple-300">342</p>
              </div>
              <div className="rounded-lg bg-slate-950/50 p-4">
                <p className="text-sm text-slate-500">Errors</p>
                <p className="mt-2 text-3xl font-bold text-red-300">3</p>
              </div>
            </div>
          </div>
        )}

        {selectedReport === 'security' && (
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-white">Security Report</h3>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-lg bg-slate-950/50 p-4 border border-emerald-500/20">
                <p className="text-sm text-emerald-300">✓ Security Status</p>
                <p className="mt-2 font-semibold text-white">All Clear</p>
              </div>
              <div className="rounded-lg bg-slate-950/50 p-4 border border-yellow-500/20">
                <p className="text-sm text-yellow-300">⚠ Warnings</p>
                <p className="mt-2 font-semibold text-white">2 Minor Issues</p>
              </div>
              <div className="rounded-lg bg-slate-950/50 p-4 border border-slate-700">
                <p className="text-sm text-slate-400">Last Scan</p>
                <p className="mt-2 font-semibold text-white">2 hours ago</p>
              </div>
            </div>
          </div>
        )}

        {/* Export Buttons */}
        <div className="mt-8 flex gap-3 pt-6 border-t border-slate-800">
          <button
            onClick={() => handleExportReport('PDF')}
            className="rounded-lg bg-emerald-500/20 px-4 py-2 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-500/30"
          >
            📄 Export as PDF
          </button>
          <button
            onClick={() => handleExportReport('CSV')}
            className="rounded-lg bg-blue-500/20 px-4 py-2 text-sm font-semibold text-blue-300 transition hover:bg-blue-500/30"
          >
            📊 Export as CSV
          </button>
          <button
            onClick={() => handleExportReport('JSON')}
            className="rounded-lg bg-purple-500/20 px-4 py-2 text-sm font-semibold text-purple-300 transition hover:bg-purple-500/30"
          >
            {} Export as JSON
          </button>
        </div>
      </div>
    </section>
  )
}

export default AdminReports
