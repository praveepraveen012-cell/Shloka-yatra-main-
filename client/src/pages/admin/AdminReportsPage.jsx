import React from 'react';
import { Download, FileSpreadsheet, Users, CreditCard, Calendar, ShieldCheck } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../services/api';

export default function AdminReportsPage() {
  const reports = [
    {
      title: 'Master Bookings & Revenue Report',
      description: 'Comprehensive export of all registered bookings with financials, balances, routes, and payment states.',
      icon: CreditCard,
      type: 'bookings',
      filename: 'shloka-master-bookings.csv',
      color: 'text-[#2F6FED]',
      bg: 'bg-[#2F6FED]/15',
    },
    {
      title: 'Yatris & Passengers Manifest',
      description: 'Full manifest of all travellers per departure batch, including passport numbers, emergency contacts, and doc status.',
      icon: Users,
      type: 'yatris',
      filename: 'shloka-yatris-manifest.csv',
      color: 'text-[#D9A441]',
      bg: 'bg-[#D9A441]/15',
    },
    {
      title: 'Financial Receipts & Payments Ledger',
      description: 'Detailed ledger of online gateway transactions and verified offline receipts with transaction IDs and UTRs.',
      icon: FileSpreadsheet,
      type: 'payments',
      filename: 'shloka-financial-ledger.csv',
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/15',
    },
    {
      title: 'Member Registrations Directory',
      description: 'Export of verified devotee community members, preferred 2027 batches, packages, and contact numbers.',
      icon: ShieldCheck,
      type: 'members',
      url: '/api/admin/members/export/csv',
      filename: 'shloka-members-directory.csv',
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/15',
    },
  ];

  const handleDownload = (report) => {
    const url = report.url || api.getAdminReportCsvUrl(report.type);
    window.open(url, '_blank');
  };

  return (
    <AdminLayout
      title="Reports & Compliance Exports"
      subtitle="Export live operational spreadsheets, passenger manifests, and financial accounting ledgers"
    >
      <div className="space-y-6 font-body">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {reports.map((r) => {
            const Icon = r.icon;
            return (
              <div
                key={r.title}
                className="bg-[#071B3A] border border-[#D9E2EF]/15 rounded-2xl p-6 flex flex-col justify-between space-y-4 hover:border-[#D9E2EF]/30 transition-colors shadow-lg"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl ${r.bg} ${r.color} flex items-center justify-center shrink-0`}>
                    <Icon size={24} />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-base text-white">{r.title}</h3>
                    <p className="text-xs text-[#8CA8CC] mt-1 leading-relaxed">{r.description}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[11px] text-[#8CA8CC] font-mono">{r.filename}</span>
                  <button
                    onClick={() => handleDownload(r)}
                    className="px-4 py-2 bg-[#2F6FED] hover:bg-[#2557c4] text-white text-xs font-semibold rounded-xl flex items-center gap-2 transition-colors cursor-pointer shadow-md"
                  >
                    <Download size={14} />
                    <span>Download CSV</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AdminLayout>
  );
}
