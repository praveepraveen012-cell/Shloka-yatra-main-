import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Search, ExternalLink, Calendar, CheckCircle } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../services/api';

export default function AdminWhatsAppPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const loadMessages = async () => {
    try {
      setLoading(true);
      const res = await api.getAdminWhatsAppMessages();
      setMessages(res.messages || []);
    } catch (err) {
      console.error('Failed to load WhatsApp messages', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const filtered = messages.filter((m) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      (m.recipientName && m.recipientName.toLowerCase().includes(q)) ||
      (m.recipientPhone && m.recipientPhone.includes(q)) ||
      (m.templateKey && m.templateKey.toLowerCase().includes(q)) ||
      (m.booking?.bookingReference && m.booking.bookingReference.toLowerCase().includes(q))
    );
  });

  return (
    <AdminLayout
      title="WhatsApp Updates & Communications"
      subtitle="Operational audit log of all automated and manual WhatsApp messages sent to pilgrims"
    >
      <div className="space-y-6 font-body">
        {/* Search */}
        <div className="bg-[#071B3A] p-4 rounded-2xl border border-[#D9E2EF]/15">
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8CA8CC]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by devotee name, phone, template, or booking ref..."
              className="w-full bg-[#041329] border border-[#D9E2EF]/20 text-white rounded-xl pl-10 pr-4 py-2 text-xs outline-none focus:border-[#2F6FED]"
            />
          </div>
        </div>

        {/* Message Log Table */}
        <div className="bg-[#071B3A] border border-[#D9E2EF]/15 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#041329] text-[#8CA8CC] uppercase font-semibold border-b border-[#D9E2EF]/15">
                  <th className="py-3 px-4">Recipient</th>
                  <th className="py-3 px-4">Booking Ref</th>
                  <th className="py-3 px-4">Template</th>
                  <th className="py-3 px-4">Message Snippet</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Sent By & Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-[#8CA8CC]">
                      {loading ? 'Loading communication logs...' : 'No WhatsApp messages dispatched yet.'}
                    </td>
                  </tr>
                ) : (
                  filtered.map((m) => (
                    <tr key={m.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-white">{m.recipientName}</div>
                        <div className="text-[11px] text-[#8CA8CC] font-mono">{m.recipientPhone}</div>
                      </td>
                      <td className="py-3 px-4">
                        {m.booking ? (
                          <Link
                            to={`/admin/bookings/${m.booking.id}`}
                            className="text-[#2F6FED] hover:underline font-bold font-mono"
                          >
                            {m.booking.bookingReference}
                          </Link>
                        ) : (
                          <span className="text-[#8CA8CC] font-mono">General</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-medium text-white">{m.templateKey || 'CUSTOM'}</span>
                      </td>
                      <td className="py-3 px-4 max-w-sm">
                        <p className="line-clamp-2 text-[#D9E2EF] text-[11px] bg-white/5 p-1.5 rounded">
                          {m.messageContent}
                        </p>
                      </td>
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                          {m.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right text-[#8CA8CC] whitespace-nowrap">
                        <div className="text-white text-[11px]">{m.sentBy || 'Admin'}</div>
                        <div className="text-[10px]">{new Date(m.createdAt).toLocaleString()}</div>
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
