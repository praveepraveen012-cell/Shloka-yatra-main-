import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import {
  LayoutDashboard,
  Calendar,
  Users,
  MessageSquare,
  DollarSign,
  Activity,
  LogOut,
  ExternalLink,
  Shield,
  UserCheck,
  FileCheck,
  RotateCcw,
  Menu,
  X,
  CreditCard,
  MessageCircle,
  FileSpreadsheet,
  UserCog,
  Settings,
} from 'lucide-react';

export default function AdminLayout({ children, title, subtitle }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('shlloka_admin_user');
      if (stored) {
        setUser(JSON.parse(stored));
      } else {
        api.getAdminProfile().then((res) => {
          if (res?.user) setUser(res.user);
        }).catch(() => {});
      }
    } catch (e) {}
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('shlloka_admin_token');
    localStorage.removeItem('shlloka_admin_user');
    navigate('/admin/login');
  };

  const menuItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Bookings & Yatris', path: '/admin/bookings', icon: Calendar },
    { label: 'Registered Members', path: '/admin/members', icon: UserCheck },
    { label: 'Customer Management', path: '/admin/customers', icon: Users },
    { label: 'Payments & Revenue', path: '/admin/payments', icon: CreditCard },
    { label: 'Departures (2027)', path: '/admin/departures', icon: Calendar },
    { label: 'Route Pricing', path: '/admin/pricing', icon: DollarSign },
    { label: 'Document Verification', path: '/admin/documents', icon: FileCheck },
    { label: 'Refund Requests', path: '/admin/refunds', icon: RotateCcw },
    { label: 'Enquiries & Leads', path: '/admin/enquiries', icon: MessageSquare },
    { label: 'WhatsApp Updates', path: '/admin/whatsapp', icon: MessageCircle },
    { label: 'Reports & Export', path: '/admin/reports', icon: FileSpreadsheet },
    { label: 'Super Admin Settings', path: '/admin/settings', icon: Settings },
    { label: 'Audit Trail', path: '/admin/audit-logs', icon: Activity },
  ];

  return (
    <div className="flex min-h-screen bg-[#041329] text-white font-body relative overflow-x-hidden">
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-xs"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 w-64 bg-[#071B3A] border-r border-[#D9E2EF]/15 flex flex-col justify-between shrink-0 z-50 transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Brand */}
          <div className="p-5 border-b border-[#D9E2EF]/15 flex items-center justify-between">
            <Link
              to="/admin/dashboard"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 text-white group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#D9A441]/15 border border-[#D9A441]/40 flex items-center justify-center text-[#D9A441] text-xl font-bold shadow-md shadow-[#D9A441]/10 group-hover:border-[#D9A441] transition-colors">
                ॐ
              </div>
              <div>
                <b className="block text-sm tracking-widest font-heading text-white">
                  SHLOKA ADMIN
                </b>
                <small className="text-[10px] text-[#D9A441] tracking-wider block font-semibold">
                  PILGRIMAGE COMMAND
                </small>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-[#8CA8CC] hover:text-white p-1"
              aria-label="Close admin menu"
            >
              <X size={20} />
            </button>
          </div>

          {/* Nav List */}
          <nav className="p-3 flex flex-col gap-1 overflow-y-auto max-h-[calc(100vh-190px)]">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                location.pathname === item.path ||
                (item.path === '/admin/bookings' && location.pathname.startsWith('/admin/bookings/'));
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-[#D9A441]/20 to-[#2F6FED]/20 text-[#D9A441] border border-[#D9A441]/40 font-semibold shadow-sm'
                      : 'text-[#D3DDEB] hover:bg-white/5 border border-transparent hover:text-white'
                  }`}
                >
                  <Icon size={16} className={isActive ? 'text-[#D9A441]' : 'text-[#8CA8CC]'} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-[#D9E2EF]/15 space-y-2">
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 text-[#8CA8CC] hover:text-white text-xs transition-colors"
          >
            <ExternalLink size={15} />
            <span>Open Public Website</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-red-500/40 bg-red-500/15 text-red-400 text-xs font-semibold hover:bg-red-500/25 transition-colors cursor-pointer"
          >
            <LogOut size={15} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Top Header */}
        <header className="px-4 sm:px-8 py-4 sm:py-5 bg-[#071B3A] border-b border-[#D9E2EF]/15 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg bg-white/5 border border-white/10 text-white min-w-[40px] min-h-[40px] flex items-center justify-center shrink-0"
              aria-label="Open admin menu"
            >
              <Menu size={20} />
            </button>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl md:text-2xl font-heading font-semibold text-white truncate">
                {title}
              </h1>
              {subtitle && (
                <p className="text-xs text-[#8CA8CC] mt-0.5 truncate hidden sm:block">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold border border-white/10 transition-colors"
            >
              <ExternalLink size={13} />
              <span>Public Portal</span>
            </Link>

            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#D9A441]/15 text-[#D9A441] text-xs font-bold border border-[#D9A441]/35 shadow-sm">
              <Shield size={13} className="text-[#D9A441]" />
              <span>SUPER ADMIN</span>
            </span>
          </div>
        </header>

        {/* Viewport */}
        <div className="p-4 sm:p-6 lg:p-8 flex-1 min-w-0 overflow-x-hidden">{children}</div>
      </main>
    </div>
  );
}
