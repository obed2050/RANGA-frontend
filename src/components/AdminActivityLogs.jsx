import { useState, useEffect } from 'react'

const AdminActivityLogs = ({ user }) => {
  const [activityLogs, setActivityLogs] = useState([])
  const [filterAction, setFilterAction] = useState('all')
  const [filterDate, setFilterDate] = useState('all')

  useEffect(() => {
    // Mock activity logs from localStorage
    const logs = JSON.parse(localStorage.getItem('admin_activity_logs') || '[]')
    setActivityLogs(logs)
  }, [])

  const actions = ['all', 'USER_DELETED', 'AD_DELETED', 'USER_UPDATED', 'AD_FLAGGED', 'AD_UNFLAGGED']

  const filteredLogs = activityLogs.filter((log) => {
    const matchesAction = filterAction === 'all' || log.action === filterAction
    return matchesAction
  })

  const ActionBadge = ({ action }) => {
    const colors = {
      USER_DELETED: 'bg-red-500/20 text-red-300',
      AD_DELETED: 'bg-red-500/20 text-red-300',
      USER_UPDATED: 'bg-blue-500/20 text-blue-300',
      AD_FLAGGED: 'bg-yellow-500/20 text-yellow-300',
      AD_UNFLAGGED: 'bg-emerald-500/20 text-emerald-300',
    }
    return (
      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${colors[action] || ''}`}>
        {action.replace(/_/g, ' ')}
      </span>
    )
  }

  return (
    <section className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-white">Activity Logs</h2>
        <p className="mt-2 text-slate-400">Track all system activities and admin actions</p>
      </div>

      {/* Filters */}
      <div className="grid gap-4 md:grid-cols-2">
        <select
          value={filterAction}
          onChange={(e) => setFilterAction(e.target.value)}
          className="rounded-3xl border border-slate-800 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none focus:border-emerald-500"
        >
          {actions.map((action) => (
            <option key={action} value={action}>
              {action === 'all' ? 'All Actions' : action.replace(/_/g, ' ')}
            </option>
          ))}
        </select>

        <div className="rounded-3xl border border-slate-800 bg-slate-950/90 px-4 py-3">
          <p className="text-xs text-slate-500">Total Logs: {filteredLogs.length}</p>
        </div>
      </div>

      {/* Activity Log Timeline */}
      <div className="space-y-3">
        {filteredLogs.length === 0 ? (
          <div className="rounded-[20px] border border-slate-800/80 bg-slate-900/70 p-8 text-center shadow-soft">
            <p className="text-slate-400">No activity logs found.</p>
          </div>
        ) : (
          filteredLogs.map((log, index) => (
            <div key={index} className="rounded-[20px] border border-slate-800/80 bg-slate-900/70 p-4 shadow-soft">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <ActionBadge action={log.action} />
                    <p className="font-medium text-white">{log.description}</p>
                  </div>
                  <p className="mt-2 text-sm text-slate-500">
                    By: <span className="text-slate-300">{log.admin || 'System'}</span>
                  </p>
                  <p className="text-xs text-slate-600">
                    {new Date(log.timestamp).toLocaleString()}
                  </p>
                </div>
                <div className="rounded-full bg-slate-950/50 px-3 py-1">
                  <p className="text-xs font-semibold text-emerald-300">{log.status || 'Success'}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Log Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-[20px] border border-red-800/30 bg-red-500/10 p-4 shadow-soft">
          <p className="text-sm text-red-300">Deletions</p>
          <p className="mt-2 text-2xl font-bold text-red-300">
            {filteredLogs.filter((l) => l.action.includes('DELETED')).length}
          </p>
        </div>
        <div className="rounded-[20px] border border-blue-800/30 bg-blue-500/10 p-4 shadow-soft">
          <p className="text-sm text-blue-300">Updates</p>
          <p className="mt-2 text-2xl font-bold text-blue-300">
            {filteredLogs.filter((l) => l.action.includes('UPDATED')).length}
          </p>
        </div>
        <div className="rounded-[20px] border border-yellow-800/30 bg-yellow-500/10 p-4 shadow-soft">
          <p className="text-sm text-yellow-300">Flagged</p>
          <p className="mt-2 text-2xl font-bold text-yellow-300">
            {filteredLogs.filter((l) => l.action === 'AD_FLAGGED').length}
          </p>
        </div>
        <div className="rounded-[20px] border border-emerald-800/30 bg-emerald-500/10 p-4 shadow-soft">
          <p className="text-sm text-emerald-300">Total Actions</p>
          <p className="mt-2 text-2xl font-bold text-emerald-300">{filteredLogs.length}</p>
        </div>
      </div>
    </section>
  )
}

export default AdminActivityLogs
