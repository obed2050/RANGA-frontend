import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext.jsx'

const EMPTY_FORM = { fullName: '', email: '', password: '', phoneNumber: '', location: '', gender: 'female', role: 'seller' }

const AdminUserManagement = () => {
  const { getAllUsers, createUser, deleteUser, updateUser } = useAuth()
  const [allUsers, setAllUsers] = useState([])
  const [searchUser, setSearchUser] = useState('')
  const [filterRole, setFilterRole] = useState('all')
  const [editingUser, setEditingUser] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [showCreate, setShowCreate] = useState(false)
  const [createForm, setCreateForm] = useState(EMPTY_FORM)
  const [creating, setCreating] = useState(false)

  useEffect(() => { getAllUsers().then(setAllUsers) }, [])

  const filteredUsers = allUsers.filter((u) => {
    const matchesSearch =
      u.fullName.toLowerCase().includes(searchUser.toLowerCase()) ||
      u.email.toLowerCase().includes(searchUser.toLowerCase())
    const matchesRole = filterRole === 'all' || u.role === filterRole
    return matchesSearch && matchesRole
  })

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!createForm.fullName || !createForm.email || !createForm.password) {
      toast.error('Fullname, email na password birakenewe.')
      return
    }
    setCreating(true)
    try {
      const newUser = await createUser({
        fullName: createForm.fullName,
        email: createForm.email,
        password: createForm.password,
        phoneNumber: createForm.phoneNumber,
        location: createForm.location,
        gender: createForm.gender,
        role: createForm.role,
      })
      setAllUsers((prev) => [newUser, ...prev])
      setCreateForm(EMPTY_FORM)
      setShowCreate(false)
      toast.success(`✅ User "${newUser.fullName}" yashyizweho neza!`)
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Gucreate user byanze.')
    } finally {
      setCreating(false)
    }
  }

  const handleEditStart = (user) => { setEditingUser(user.id); setEditForm({ ...user }) }

  const handleEditSave = async (userId) => {
    await updateUser(userId, editForm)
    setAllUsers((prev) => prev.map((u) => u.id === userId ? { ...u, ...editForm } : u))
    setEditingUser(null)
    toast.success('User yahinduwe neza!')
  }

  const handleDeleteUser = async (userId) => {
    if (confirm('Uzi neza ko ushaka gusiba uyu muntu?')) {
      await deleteUser(userId)
      setAllUsers((prev) => prev.filter((u) => u.id !== userId))
      toast.success('User yasibwe neza!')
    }
  }

  const roleStats = {
    admin: allUsers.filter((u) => u.role === 'admin').length,
    seller: allUsers.filter((u) => u.role === 'seller').length,
    buyer: allUsers.filter((u) => u.role === 'buyer').length,
  }

  const inputCls = 'w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-emerald-500'
  const labelCls = 'block text-xs font-medium text-slate-400 mb-1'

  return (
    <section className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">User Management</h2>
          <p className="mt-2 text-slate-400">Manage users, roles, and permissions</p>
        </div>
        <button
          onClick={() => { setShowCreate((c) => !c); setCreateForm(EMPTY_FORM) }}
          className="flex items-center gap-2 rounded-xl bg-emerald-500/20 px-5 py-2.5 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-500/30"
        >
          {showCreate ? '✕ Cancel' : '➕ Create User'}
        </button>
      </div>

      {/* ── Create User Form ── */}
      {showCreate && (
        <form
          onSubmit={handleCreate}
          className="rounded-[20px] border border-emerald-500/30 bg-emerald-500/5 p-6 shadow-soft space-y-5"
        >
          <h3 className="text-lg font-semibold text-emerald-300">➕ Create New User</h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Full Name *</label>
              <input
                type="text"
                value={createForm.fullName}
                onChange={(e) => setCreateForm((p) => ({ ...p, fullName: e.target.value }))}
                className={inputCls}
                placeholder="Amina Uwase"
                required
              />
            </div>
            <div>
              <label className={labelCls}>Email *</label>
              <input
                type="email"
                value={createForm.email}
                onChange={(e) => setCreateForm((p) => ({ ...p, email: e.target.value }))}
                className={inputCls}
                placeholder="amina@ranga.rw"
                required
              />
            </div>
            <div>
              <label className={labelCls}>Password *</label>
              <input
                type="password"
                value={createForm.password}
                onChange={(e) => setCreateForm((p) => ({ ...p, password: e.target.value }))}
                className={inputCls}
                placeholder="Min. 6 characters"
                minLength={6}
                required
              />
            </div>
            <div>
              <label className={labelCls}>Phone Number</label>
              <input
                type="tel"
                value={createForm.phoneNumber}
                onChange={(e) => setCreateForm((p) => ({ ...p, phoneNumber: e.target.value }))}
                className={inputCls}
                placeholder="0780000000"
              />
            </div>
            <div>
              <label className={labelCls}>Location</label>
              <input
                type="text"
                value={createForm.location}
                onChange={(e) => setCreateForm((p) => ({ ...p, location: e.target.value }))}
                className={inputCls}
                placeholder="Kigali, Rwanda"
              />
            </div>
            <div>
              <label className={labelCls}>Gender</label>
              <select
                value={createForm.gender}
                onChange={(e) => setCreateForm((p) => ({ ...p, gender: e.target.value }))}
                className={inputCls}
              >
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Role *</label>
              <select
                value={createForm.role}
                onChange={(e) => setCreateForm((p) => ({ ...p, role: e.target.value }))}
                className={inputCls}
              >
                <option value="buyer">Buyer</option>
                <option value="seller">Seller</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={creating}
              className="rounded-xl bg-emerald-500/20 px-6 py-2.5 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-500/30 disabled:opacity-50"
            >
              {creating ? 'Creating...' : '✅ Create User'}
            </button>
            <button
              type="button"
              onClick={() => setShowCreate(false)}
              className="rounded-xl bg-slate-700/50 px-6 py-2.5 text-sm text-slate-300 transition hover:bg-slate-700"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Role Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-[20px] border border-slate-800/80 bg-slate-900/70 p-4 shadow-soft">
          <p className="text-sm text-slate-400">Total Users</p>
          <p className="mt-2 text-3xl font-bold text-slate-100">{allUsers.length}</p>
        </div>
        <div className="rounded-[20px] border border-red-800/30 bg-red-500/10 p-4 shadow-soft">
          <p className="text-sm text-red-300">Admins</p>
          <p className="mt-2 text-3xl font-bold text-red-300">{roleStats.admin}</p>
        </div>
        <div className="rounded-[20px] border border-blue-800/30 bg-blue-500/10 p-4 shadow-soft">
          <p className="text-sm text-blue-300">Sellers</p>
          <p className="mt-2 text-3xl font-bold text-blue-300">{roleStats.seller}</p>
        </div>
        <div className="rounded-[20px] border border-purple-800/30 bg-purple-500/10 p-4 shadow-soft">
          <p className="text-sm text-purple-300">Buyers</p>
          <p className="mt-2 text-3xl font-bold text-purple-300">{roleStats.buyer}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="grid gap-4 md:grid-cols-2">
        <input
          type="search"
          placeholder="Search by name or email..."
          value={searchUser}
          onChange={(e) => setSearchUser(e.target.value)}
          className="rounded-3xl border border-slate-800 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none focus:border-emerald-500"
        />
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="rounded-3xl border border-slate-800 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none focus:border-emerald-500"
        >
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="seller">Seller</option>
          <option value="buyer">Buyer</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto rounded-[20px] border border-slate-800/80 bg-slate-900/70 shadow-soft">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-800 bg-slate-950/50">
            <tr>
              <th className="px-6 py-4 font-semibold text-slate-300">Name</th>
              <th className="px-6 py-4 font-semibold text-slate-300">Email</th>
              <th className="px-6 py-4 font-semibold text-slate-300">Role</th>
              <th className="px-6 py-4 font-semibold text-slate-300">Phone</th>
              <th className="px-6 py-4 font-semibold text-slate-300">Location</th>
              <th className="px-6 py-4 font-semibold text-slate-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="border-b border-slate-800/50 hover:bg-slate-950/30 transition">
                <td className="px-6 py-4 text-white">
                  {editingUser === user.id ? (
                    <input type="text" value={editForm.fullName}
                      onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                      className="rounded border border-emerald-500 bg-slate-950 px-2 py-1 text-sm text-white" />
                  ) : user.fullName}
                </td>
                <td className="px-6 py-4 text-slate-400">{user.email}</td>
                <td className="px-6 py-4">
                  {editingUser === user.id ? (
                    <select value={editForm.role}
                      onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                      className="rounded border border-emerald-500 bg-slate-950 px-2 py-1 text-sm text-white">
                      <option value="admin">Admin</option>
                      <option value="seller">Seller</option>
                      <option value="buyer">Buyer</option>
                    </select>
                  ) : (
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                      user.role === 'admin' ? 'bg-red-500/20 text-red-300'
                      : user.role === 'seller' ? 'bg-blue-500/20 text-blue-300'
                      : 'bg-purple-500/20 text-purple-300'
                    }`}>{user.role}</span>
                  )}
                </td>
                <td className="px-6 py-4 text-slate-400">
                  {editingUser === user.id ? (
                    <input type="text" value={editForm.phoneNumber}
                      onChange={(e) => setEditForm({ ...editForm, phoneNumber: e.target.value })}
                      className="rounded border border-emerald-500 bg-slate-950 px-2 py-1 text-sm text-white" />
                  ) : (user.phoneNumber || 'N/A')}
                </td>
                <td className="px-6 py-4 text-slate-400">
                  {editingUser === user.id ? (
                    <input type="text" value={editForm.location}
                      onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                      className="rounded border border-emerald-500 bg-slate-950 px-2 py-1 text-sm text-white" />
                  ) : (user.location || 'N/A')}
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    {editingUser === user.id ? (
                      <>
                        <button onClick={() => handleEditSave(user.id)}
                          className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs text-emerald-300 hover:bg-emerald-500/30">
                          Save
                        </button>
                        <button onClick={() => setEditingUser(null)}
                          className="rounded-full bg-slate-700/50 px-3 py-1 text-xs text-slate-300 hover:bg-slate-700">
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => handleEditStart(user)}
                          className="rounded-full bg-slate-700/50 px-3 py-1 text-xs text-slate-300 hover:bg-slate-700">
                          Edit
                        </button>
                        <button onClick={() => handleDeleteUser(user.id)}
                          className="rounded-full bg-red-500/20 px-3 py-1 text-xs text-red-300 hover:bg-red-500/30">
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredUsers.length === 0 && (
        <div className="rounded-[20px] border border-slate-800/80 bg-slate-900/70 p-8 text-center shadow-soft">
          <p className="text-slate-400">No users found matching your filters.</p>
        </div>
      )}
    </section>
  )
}

export default AdminUserManagement
