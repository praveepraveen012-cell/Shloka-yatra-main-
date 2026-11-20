import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Search, Mail, Phone, Calendar, ExternalLink, ShieldCheck } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../services/api';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search.trim()) params.append('search', search.trim());
      const res = await api.getAdminCustomers(params.toString());
      setCustomers(res.customers || []);
    } catch (err) {
      console.error('Failed to load customers', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadCustomers();
  };

  return (
    <AdminLayout
      title="Customer Management"
      subtitle="Unified directory of pilgrims, booking holders, and registered devotees"
    >
      <div className="space-y-6 font-body">
        {/* Search Bar */}
        <div className="bg-[#071B3A] p-4 rounded-2xl border border-[#D9E2EF]/15">
          <form onSubmit={handleSearchSubmit} className="flex gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8CA8CC]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search customers by devotee name, email, or mobile..."
                className="w-full bg-[#041329] border border-[#D9E2EF]/20 text-white rounded-xl pl-10 pr-4 py-2 text-xs outline-none focus:border-[#2F6FED]"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-[#2F6FED] hover:bg-[#2557c4] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Search
            </button>
          </form>
        </div>

        {/* Customers Table */}
        <div className="bg-[#071B3A] border border-[#D9E2EF]/15 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#041329] text-[#8CA8CC] uppercase font-semibold border-b border-[#D9E2EF]/15">
                  <th className="py-3 px-4">Customer Name</th>
                  <th className="py-3 px-4">Contact Info</th>
                  <th className="py-3 px-4 text-center">Bookings</th>
                  <th className="py-3 px-4 text-right">Total Spent</th>
                  <th className="py-3 px-4 text-center">Account Status</th>
                  <th className="py-3 px-4 text-right">Latest Pilgrimage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {customers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-[#8CA8CC]">
                      {loading ? 'Aggregating customer database...' : 'No customer profiles found in database.'}
                    </td>
                  </tr>
                ) : (
                  customers.map((c, idx) => (
                    <tr key={c.email || idx} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-white">{c.name}</div>
                        {c.member && (
                          <div className="text-[10px] text-[#D9A441] mt-0.5 font-mono">
                            Member #{c.member.membershipReference} ({c.member.membershipType})
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-white flex items-center gap-1.5">
                          <Phone size={11} className="text-[#8CA8CC]" />
                          <span>{c.phone}</span>
                        </div>
                        <div className="text-[11px] text-[#8CA8CC] flex items-center gap-1.5 mt-0.5">
                          <Mail size={11} className="text-[#8CA8CC]" />
                          <span className="truncate max-w-[180px]">{c.email}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="inline-block px-2 py-0.5 rounded-full bg-white/10 text-white font-bold text-xs">
                          {c.totalBookings}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-emerald-400">
                        ₹{c.totalSpent.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                            c.status === 'REGISTERED_MEMBER'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              : 'bg-[#2F6FED]/20 text-[#2F6FED] border border-[#2F6FED]/40'
                          }`}
                        >
                          {c.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        {c.bookings && c.bookings.length > 0 ? (
                          <Link
                            to={`/admin/bookings/${c.bookings[0].id}`}
                            className="text-[#2F6FED] hover:underline font-mono text-[11px] block"
                          >
                            {c.bookings[0].bookingReference}
                          </Link>
                        ) : (
                          <span className="text-[#8CA8CC] text-[11px]">Member Only</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
