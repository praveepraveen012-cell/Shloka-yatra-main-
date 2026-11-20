import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import {
  Shield,
  KeyRound,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  Save,
  MessageCircle,
  Lock,
  Eye,
  EyeOff,
  Bell,
  RefreshCw,
  LogOut,
} from 'lucide-react';
import { api } from '../../services/api';

export default function AdminSettingsPage() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('SECURITY');

  // Password Change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [passLoading, setPassLoading] = useState(false);
  const [passSuccess, setPassSuccess] = useState(null);
  const [passError, setPassError] = useState(null);

  // Profile state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(null);
  const [profileError, setProfileError] = useState(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('shlloka_admin_user');
      if (stored) {
        const u = JSON.parse(stored);
        setUser(u);
        setName(u.name || '');
        setPhone(u.phone || '');
      } else {
        api.getAdminProfile().then((res) => {
          if (res?.user) {
            setUser(res.user);
            setName(res.user.name || '');
            setPhone(res.user.phone || '');
          }
        }).catch(() => {});
      }
    } catch (e) {}
  }, []);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPassLoading(true);
    setPassSuccess(null);
    setPassError(null);

    if (newPassword.length < 8) {
      setPassError('New password must be at least 8 characters long.');
      setPassLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setPassError('New password and confirmation do not match.');
      setPassLoading(false);
      return;
    }

    try {
      const res = await api.changeAdminPassword({ currentPassword, newPassword });
      setPassSuccess(res.message || 'Password changed successfully. Your account is secured.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      if (user) {
        const updatedUser = { ...user, mustChangePassword: false };
        setUser(updatedUser);
        localStorage.setItem('shlloka_admin_user', JSON.stringify(updatedUser));
      }
    } catch (err) {
      setPassError(err.message || 'Failed to change password. Please verify current password.');
    } finally {
      setPassLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileSuccess(null);
    setProfileError(null);

    try {
      const res = await api.updateAdminProfile({ name, phone });
      setProfileSuccess(res.message || 'Administrator profile updated successfully.');
      if (res.user) {
        setUser(res.user);
        localStorage.setItem('shlloka_admin_user', JSON.stringify(res.user));
      }
    } catch (err) {
      setProfileError(err.message || 'Failed to update profile.');
    } finally {
      setProfileLoading(false);
    }
  };

  return (
    <AdminLayout
      title="Admin Settings & Security"
      subtitle="Manage master administrator credentials, profile, integrations and security policies"
    >
      {/* Alert if temporary password must be changed */}
      {user?.mustChangePassword && (
        <div className="mb-6 p-4 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-amber-200 flex items-start gap-3 shadow-lg">
          <AlertCircle size={20} className="shrink-0 text-amber-400 mt-0.5" />
          <div className="text-sm leading-relaxed">
            <strong className="block font-semibold text-white">Temporary Password Active</strong>
            For operational security, please set your new permanent password below.
          </div>
        </div>
      )}

      {/* Settings Navigation Tabs */}
      <div className="flex border-b border-white/10 mb-8 overflow-x-auto gap-4 sm:gap-8">
        <button
          onClick={() => setActiveTab('SECURITY')}
          className={`pb-3.5 text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all flex items-center gap-2 border-b-2 cursor-pointer ${
            activeTab === 'SECURITY'
              ? 'border-[#D9A441] text-[#D9A441]'
              : 'border-transparent text-[#8CA8CC] hover:text-white'
          }`}
        >
          <Lock size={16} />
          <span>Security & Password</span>
        </button>

        <button
          onClick={() => setActiveTab('PROFILE')}
          className={`pb-3.5 text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all flex items-center gap-2 border-b-2 cursor-pointer ${
            activeTab === 'PROFILE'
              ? 'border-[#D9A441] text-[#D9A441]'
              : 'border-transparent text-[#8CA8CC] hover:text-white'
          }`}
        >
          <UserCheck size={16} />
          <span>Administrator Profile</span>
        </button>

        <button
          onClick={() => setActiveTab('INTEGRATIONS')}
          className={`pb-3.5 text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all flex items-center gap-2 border-b-2 cursor-pointer ${
            activeTab === 'INTEGRATIONS'
              ? 'border-[#D9A441] text-[#D9A441]'
              : 'border-transparent text-[#8CA8CC] hover:text-white'
          }`}
        >
          <MessageCircle size={16} />
          <span>Integrations & Updates</span>
        </button>
      </div>

      {/* Tab 1: Security & Password */}
      {activeTab === 'SECURITY' && (
        <div className="max-w-2xl bg-[#071830] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
            <div className="w-10 h-10 rounded-xl bg-[#D9A441]/15 text-[#D9A441] flex items-center justify-center">
              <KeyRound size={20} />
            </div>
            <div>
              <h2 className="text-lg font-heading font-bold text-white">Change Master Password</h2>
              <p className="text-xs text-[#8CA8CC]">Update administrator authentication credentials</p>
            </div>
          </div>

          {passSuccess && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-200 text-xs sm:text-sm flex items-center gap-2.5">
              <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
              <span>{passSuccess}</span>
            </div>
          )}

          {passError && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/15 border border-red-500/40 text-red-200 text-xs sm:text-sm flex items-center gap-2.5">
              <AlertCircle size={18} className="text-red-400 shrink-0" />
              <span>{passError}</span>
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-[#D3DDEB] uppercase tracking-wider mb-2">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrent ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  required
                  className="w-full bg-[#041021] border border-white/10 rounded-xl pl-4 pr-11 py-3 text-sm text-white placeholder:text-white/30 focus:border-[#D9A441] outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8CA8CC] hover:text-[#D9A441]"
                >
                  {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#D3DDEB] uppercase tracking-wider mb-2">
                New Password (minimum 8 characters)
              </label>
              <div className="relative">
                <input
                  type={showNew ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new strong password"
                  required
                  minLength={8}
                  className="w-full bg-[#041021] border border-white/10 rounded-xl pl-4 pr-11 py-3 text-sm text-white placeholder:text-white/30 focus:border-[#D9A441] outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8CA8CC] hover:text-[#D9A441]"
                >
                  {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#D3DDEB] uppercase tracking-wider mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                required
                className="w-full bg-[#041021] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-[#D9A441] outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={passLoading}
              className="py-3 px-6 rounded-xl bg-gradient-to-r from-[#D9A441] to-[#C99331] text-[#071322] font-heading font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:opacity-95 transition-opacity disabled:opacity-50 cursor-pointer"
            >
              {passLoading ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
              <span>{passLoading ? 'Updating Password...' : 'Save New Password'}</span>
            </button>
          </form>
        </div>
      )}

      {/* Tab 2: Profile */}
      {activeTab === 'PROFILE' && (
        <div className="max-w-2xl bg-[#071830] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
            <div className="w-10 h-10 rounded-xl bg-[#D9A441]/15 text-[#D9A441] flex items-center justify-center">
              <UserCheck size={20} />
            </div>
            <div>
              <h2 className="text-lg font-heading font-bold text-white">Administrator Profile</h2>
              <p className="text-xs text-[#8CA8CC]">Operational details and contact information</p>
            </div>
          </div>

          {profileSuccess && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-200 text-xs sm:text-sm flex items-center gap-2.5">
              <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
              <span>{profileSuccess}</span>
            </div>
          )}

          {profileError && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/15 border border-red-500/40 text-red-200 text-xs sm:text-sm flex items-center gap-2.5">
              <AlertCircle size={18} className="text-red-400 shrink-0" />
              <span>{profileError}</span>
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-[#D3DDEB] uppercase tracking-wider mb-2">
                Administrator Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Shloka Administrator"
                required
                className="w-full bg-[#041021] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-[#D9A441] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#D3DDEB] uppercase tracking-wider mb-2">
                Administrator Email Address
              </label>
              <input
                type="email"
                value={user?.email || 'admin@shloka.com'}
                disabled
                className="w-full bg-[#041021]/50 border border-white/5 rounded-xl px-4 py-3 text-sm text-[#8CA8CC] cursor-not-allowed"
              />
              <span className="text-[11px] text-[#8CA8CC] mt-1 block">Master email is locked for audit integrity.</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#D3DDEB] uppercase tracking-wider mb-2">
                Emergency Operational Phone
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 6366852888"
                className="w-full bg-[#041021] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-[#D9A441] outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={profileLoading}
              className="py-3 px-6 rounded-xl bg-gradient-to-r from-[#D9A441] to-[#C99331] text-[#071322] font-heading font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:opacity-95 transition-opacity disabled:opacity-50 cursor-pointer"
            >
              {profileLoading ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
              <span>{profileLoading ? 'Saving...' : 'Save Profile'}</span>
            </button>
          </form>
        </div>
      )}

      {/* Tab 3: Integrations */}
      {activeTab === 'INTEGRATIONS' && (
        <div className="max-w-3xl space-y-6">
          <div className="bg-[#071830] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                  <MessageCircle size={20} />
                </div>
                <div>
                  <h3 className="text-base font-heading font-bold text-white">WhatsApp Direct Click-to-Chat</h3>
                  <p className="text-xs text-[#8CA8CC]">Universal wa.me dispatch protocol with 13 approved templates</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                ACTIVE
              </span>
            </div>
            <p className="text-xs text-[#D3DDEB] leading-relaxed mb-4">
              All booking updates, payment confirmations, medical advisories and departure reminders are formatted with customer phone numbers and dispatched via direct WhatsApp click-to-chat links.
            </p>
          </div>

          <div className="bg-[#071830] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#D9A441]/15 text-[#D9A441] flex items-center justify-center">
                  <Shield size={20} />
                </div>
                <div>
                  <h3 className="text-base font-heading font-bold text-white">Security & Audit Policy</h3>
                  <p className="text-xs text-[#8CA8CC]">DPDP Act 2023 & Indian Data Protection Compliance</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#D9A441]/20 text-[#D9A441] text-xs font-bold border border-[#D9A441]/30">
                ENFORCED
              </span>
            </div>
            <p className="text-xs text-[#D3DDEB] leading-relaxed">
              Every booking update, document verification, refund transaction, and admin login is immutably logged in the database audit log with user IP and timestamp.
            </p>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
