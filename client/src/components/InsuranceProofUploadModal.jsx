import React, { useState } from 'react';
import { ShieldCheck, UploadCloud, AlertTriangle, CheckCircle, X, Info } from 'lucide-react';
import api from '../services/api';

export default function InsuranceProofUploadModal({
  isOpen,
  onClose,
  booking,
  traveller,
  onSuccess,
}) {
  if (!isOpen) return null;

  const [provider, setProvider] = useState(traveller?.insuranceProvider || '');
  const [policyNumber, setPolicyNumber] = useState(traveller?.insurancePolicyNumber || '');
  const [assistancePhone, setAssistancePhone] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileBase64, setFileBase64] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setErrorMsg('');
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      setErrorMsg('File size exceeds the 15MB limit.');
      return;
    }

    const allowed = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!allowed.includes(file.type.toLowerCase()) && !file.name.toLowerCase().endsWith('.pdf')) {
      setErrorMsg('Only PDF or JPEG/PNG files are accepted.');
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = () => setFileBase64(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!provider.trim()) {
      setErrorMsg('Please specify the insurance provider.');
      return;
    }
    if (!policyNumber.trim()) {
      setErrorMsg('Please specify the policy number.');
      return;
    }
    if (!selectedFile || !fileBase64) {
      setErrorMsg('Please upload a copy of your insurance policy document.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');
    try {
      await api.uploadInsuranceProof({
        bookingId: booking.id,
        travellerId: traveller.id || traveller.travellerId,
        insuranceProvider: provider.trim(),
        policyNumber: policyNumber.trim(),
        emergencyAssistancePhone: assistancePhone.trim() || null,
        fileData: fileBase64,
        originalFilename: selectedFile.name,
      });

      setStatusMsg('Insurance document uploaded successfully.');
      setTimeout(() => {
        if (onSuccess) onSuccess();
        onClose();
      }, 1500);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to upload insurance proof.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="bg-[#071B3A] text-white px-5 py-4 flex items-center justify-between border-b border-amber-500/30 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <ShieldCheck size={22} />
            </div>
            <div>
              <span className="text-[11px] font-bold tracking-wider px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono">
                SYPL-INS-2027
              </span>
              <h2 className="text-base sm:text-lg font-bold font-heading text-white mt-0.5">
                Upload High-Altitude Insurance Proof
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Notice */}
        <div className="bg-amber-50 border-b border-amber-200 px-5 py-3 text-xs text-amber-900 shrink-0 flex items-start gap-2">
          <Info size={16} className="text-amber-600 shrink-0 mt-0.5" />
          <span>
            Insurance must specifically cover high-altitude travel above 5,000m, emergency evacuation, and medical repatriation. A policy number alone is not sufficient; verifiable evidence must be provided.
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
          <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-400 block font-semibold text-[10px] uppercase">Devotee</span>
              <span className="font-bold text-slate-800">{traveller.fullName}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold text-[10px] uppercase">Booking Reference</span>
              <span className="font-bold text-slate-800 font-mono">{booking.bookingReference}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Insurance Company / Provider *
            </label>
            <input
              type="text"
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              placeholder="e.g. TATA AIG / ICICI Lombard / World Nomads"
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:border-[#2F6FED] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Policy Number / Reference *
            </label>
            <input
              type="text"
              value={policyNumber}
              onChange={(e) => setPolicyNumber(e.target.value)}
              placeholder="e.g. POL-8492048291"
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:border-[#2F6FED] focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              24-Hour International Assistance Phone (with country code)
            </label>
            <input
              type="text"
              value={assistancePhone}
              onChange={(e) => setAssistancePhone(e.target.value)}
              placeholder="e.g. +91 22 6693 8000"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:border-[#2F6FED] focus:outline-none"
            />
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Upload Policy Schedule / Certificate (PDF / Image) *
            </label>
            <div className="border-2 border-dashed border-slate-300 hover:border-[#2F6FED] rounded-xl p-5 text-center transition-colors cursor-pointer bg-slate-50">
              <input
                type="file"
                accept=".pdf,image/jpeg,image/png"
                onChange={handleFileChange}
                className="hidden"
                id="ins-proof-file-input"
              />
              <label htmlFor="ins-proof-file-input" className="cursor-pointer">
                <UploadCloud size={30} className="mx-auto text-slate-400 mb-1.5" />
                {selectedFile ? (
                  <div>
                    <span className="text-sm font-bold text-[#071B3A] block truncate max-w-sm mx-auto">
                      {selectedFile.name}
                    </span>
                    <span className="text-xs text-slate-500">
                      ({Math.round(selectedFile.size / 1024)} KB) • Click to change
                    </span>
                  </div>
                ) : (
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-[#2F6FED] block">
                      Choose policy document to upload
                    </span>
                    <span className="text-[11px] text-slate-400 mt-0.5 block">
                      PDF, JPG or PNG up to 15MB
                    </span>
                  </div>
                )}
              </label>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
              <AlertTriangle size={16} className="shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {statusMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
              <CheckCircle size={16} className="shrink-0" />
              <span>{statusMsg}</span>
            </div>
          )}

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-600 text-xs font-semibold hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-[#071B3A] hover:bg-slate-900 text-amber-300 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all border border-amber-500/50 disabled:opacity-50"
            >
              <UploadCloud size={16} />
              <span>{submitting ? 'Uploading...' : 'Submit Insurance Proof'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
