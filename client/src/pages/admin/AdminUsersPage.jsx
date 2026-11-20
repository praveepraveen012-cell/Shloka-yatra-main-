import React, { useEffect, useState } from 'react';
import { UserCog, Shield, Plus, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../services/api';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('ADMIN');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await api.getAdminUsers();
      setUsers(res.users || []);
    } catch (err) {
      console.error('Failed to load users', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.updateAdminUserRole(userId, { role: newRole });
      setStatusMsg(`User role updated to ${newRole}`);
      await loadUsers();
      setTimeout(() => setStatusMsg(null), 3000);
    } catch (err) {
      alert('Error updating user role: ' + err.message);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await api.createAdminUser({
        name,
        email,
        phone,
        role,
        password,
      });
      setModalOpen(false);
      setName('');
      setEmail('');
      setPhone('');
      setPassword('');
      setStatusMsg('Staff account created successfully.');
      await loadUsers();
      setTimeout(() => setStatusMsg(null), 3000);
    } catch (err) {
      alert('Failed to create staff user: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminLayout
      title="Staff & Role Permissions (RBAC)"
      subtitle="Role-based access control for operations, finance, support officers, and administrators"
    >
      <div className="space-y-6 font-body">
        {statusMsg && (
          <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 px-4 py-3 rounded-xl text-xs flex items-center gap-2">
            <CheckCircle size={16} className="text-emerald-400 shrink-0" />
            <span>{statusMsg}</span>
          </div>
        )}

        {/* Action Header */}
        <div className="flex items-center justify-between bg-[#071B3A] p-4 rounded-2xl border border-[#D9E2EF]/15">
          <div className="text-xs text-[#8CA8CC]">
            Strict RBAC: <strong className="text-white">SUPER_ADMIN, ADMIN, FINANCE, TRAVEL_OPS, SUPPORT</strong>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2 bg-[#2F6FED] hover:bg-[#2557c4] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
          >
            <Plus size={14} />
            <span>Create Staff Account</span>
          </button>
        </div>

        {/* Users Table */}
        <div className="bg-[#071B3A] border border-[#D9E2EF]/15 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#041329] text-[#8CA8CC] uppercase font-semibold border-b border-[#D9E2EF]/15">
                  <th className="py-3 px-4">Staff Member</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">Current Role</th>
                  <th className="py-3 px-4 text-right">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-10 text-[#8CA8CC]">
                      {loading ? 'Loading staff accounts...' : 'No staff accounts found.'}
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-white">{u.name}</div>
                      </td>
                      <td className="py-3 px-4 text-[#D9E2EF] font-mono">{u.email}</td>
                      <td className="py-3 px-4 text-[#8CA8CC]">{u.phone || '—'}</td>
                      <td className="py-3 px-4">
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u.id, e.target.value)}
                          className="bg-[#041329] border border-[#D9E2EF]/20 text-white rounded-lg px-2.5 py-1 text-xs outline-none cursor-pointer"
                        >
                          <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                          <option value="ADMIN">ADMIN</option>
                          <option value="FINANCE">FINANCE</option>
                          <option value="TRAVEL_OPS">TRAVEL_OPS</option>
                          <option value="SUPPORT">SUPPORT</option>
                          <option value="CONTENT_MANAGER">CONTENT_MANAGER</option>
                        </select>
                      </td>
                      <td className="py-3 px-4 text-right text-[#8CA8CC]">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create User Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 backdrop-blur-xs">
          <form
            onSubmit={handleCreateUser}
            className="bg-[#071B3A] border border-[#D9E2EF]/20 rounded-2xl max-w-md w-full p-6 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 text-[#2F6FED]">
                <UserCog size={20} />
                <h3 className="font-heading font-bold text-base text-white">Create Staff Member</h3>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-[#8CA8CC] hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-[#8CA8CC] text-xs font-semibold mb-1">Full Legal Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-[#041329] border border-[#D9E2EF]/20 text-white rounded-lg p-2.5 text-xs outline-none focus:border-[#2F6FED]"
              />
            </div>

            <div>
              <label className="block text-[#8CA8CC] text-xs font-semibold mb-1">Official Email Address *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#041329] border border-[#D9E2EF]/20 text-white rounded-lg p-2.5 text-xs outline-none focus:border-[#2F6FED]"
              />
            </div>

            <div>
              <label className="block text-[#8CA8CC] text-xs font-semibold mb-1">Direct Mobile Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-[#041329] border border-[#D9E2EF]/20 text-white rounded-lg p-2.5 text-xs outline-none"
              />
            </div>

            <div>
              <label className="block text-[#8CA8CC] text-xs font-semibold mb-1">Assigned Operational Role *</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-[#041329] border border-[#D9E2EF]/20 text-white rounded-lg p-2.5 text-xs outline-none"
              >
                <option value="ADMIN">ADMIN</option>
                <option value="TRAVEL_OPS">TRAVEL_OPS</option>
                <option value="FINANCE">FINANCE</option>
                <option value="SUPPORT">SUPPORT</option>
                <option value="CONTENT_MANAGER">CONTENT_MANAGER</option>
                <option value="SUPER_ADMIN">SUPER_ADMIN</option>
              </select>
            </div>

            <div>
              <label className="block text-[#8CA8CC] text-xs font-semibold mb-1">Initial Password (Min 8 chars) *</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="w-full bg-[#041329] border border-[#D9E2EF]/20 text-white rounded-lg p-2.5 text-xs outline-none focus:border-[#2F6FED]"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2.5 bg-[#2F6FED] hover:bg-[#2557c4] disabled:opacity-40 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                {submitting ? 'Creating...' : 'Create Account'}
              </button>
            </div>
          </form>
        </div>
      )}
    </AdminLayout>
  );
}
