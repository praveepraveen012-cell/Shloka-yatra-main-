import React, { useState } from 'react';
import { AlertCircle, X, ExternalLink } from 'lucide-react';
import { isStaticDeploymentWithoutBackend } from '../services/api';

export default function StaticHostingBanner() {
  const [dismissed, setDismissed] = useState(false);
  const show = isStaticDeploymentWithoutBackend() && !dismissed;

  if (!show) return null;

  return (
    <div className="bg-[#101D35] border-b border-[#D9A441]/40 text-[#D9E2EF] text-xs px-4 py-2.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1">
          <AlertCircle size={15} className="text-[#D9A441] shrink-0" />
          <span>
            <strong className="text-white">GitHub Pages Static Mode:</strong> GitHub Pages does not run backend servers (HTTP 405 on POST). To use member accounts, payments, and bookings live, deploy the backend server and configure{' '}
            <code className="text-[#D9A441] bg-black/30 px-1 py-0.5 rounded font-mono">VITE_API_BASE_URL</code>. For testing all features now, run the app locally on <code className="text-[#D9A441] bg-black/30 px-1 py-0.5 rounded font-mono">http://localhost:5173</code>.
          </span>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer shrink-0"
          title="Dismiss notification"
          aria-label="Dismiss notification"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
