import React, { useState } from 'react';
import {
  FileText,
  UploadCloud,
  Download,
  AlertTriangle,
  CheckCircle,
  X,
  Stethoscope,
  Info,
  ShieldAlert,
} from 'lucide-react';
import { SYPL_MEDICAL_DOCUMENT } from '../data/officialDocuments';
import api from '../services/api';

export default function MedicalCertificateUploadModal({
  isOpen,
  onClose,
  booking,
  traveller,
  onSuccess,
}) {
  if (!isOpen) return null;

  const [selectedFile, setSelectedFile] = useState(null);
  const [fileBase64, setFileBase64] = useState('');
  const [fileError, setFileError] = useState('');

  // Doctor Details
  const [doctorName, setDoctorName] = useState('');
  const [doctorRegNo, setDoctorRegNo] = useState('');
  const [doctorClinic, setDoctorClinic] = useState('');
  const [doctorCity, setDoctorCity] = useState('');
  const [doctorDecision, setDoctorDecision] = useState('FIT');

  // Participant Health self-checklist
  const [selectedConditions, setSelectedConditions] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFileError('');
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      setFileError('File size exceeds the 15MB limit.');
      return;
    }

    const allowed = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!allowed.includes(file.type.toLowerCase()) && !file.name.toLowerCase().endsWith('.pdf')) {
      setFileError('Only PDF or JPEG/PNG files are accepted.');
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setFileBase64(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleToggleCondition = (code) => {
    setSelectedConditions((prev) => ({
      ...prev,
      [code]: !prev[code],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile || !fileBase64) {
      setFileError('Please select a scanned PDF or photo of the completed doctor certificate.');
      return;
    }

    if (!doctorName.trim() || !doctorRegNo.trim()) {
      setFileError('Doctor full name and official registration number are required.');
      return;
    }

    setSubmitting(true);
    setFileError('');
    try {
      const payload = {
        bookingId: booking.id,
        travellerId: traveller.id || traveller.travellerId,
        documentRef: 'SYPL-MED-2027',
        version: SYPL_MEDICAL_DOCUMENT.version,
        fileData: fileBase64,
        originalFilename: selectedFile.name,
        formData: {
          doctorName: doctorName.trim(),
          doctorRegistrationNumber: doctorRegNo.trim(),
          doctorClinic: doctorClinic.trim(),
          doctorCity: doctorCity.trim(),
          medicalClearanceDecision: doctorDecision,
          selfDeclaredConditions: selectedConditions,
          participantName: traveller.fullName,
          bookingReference: booking.bookingReference,
        },
      };

      await api.uploadMedicalCertificate(payload);
      setStatusMsg('Certificate successfully uploaded. Queued for administrative clinical verification.');
      setTimeout(() => {
        if (onSuccess) onSuccess();
        onClose();
      }, 1500);
    } catch (err) {
      setFileError(err.message || 'Failed to upload medical certificate.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="bg-[#071B3A] text-white px-5 py-4 flex items-center justify-between border-b border-amber-500/30 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Stethoscope size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">
                  {SYPL_MEDICAL_DOCUMENT.documentRef}
                </span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-blue-500/20 text-blue-200">
                  {SYPL_MEDICAL_DOCUMENT.version}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold font-heading text-white mt-0.5">
                Upload Medical Fitness Certificate
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

        {/* Step-by-Step Instructions Banner */}
        <div className="bg-slate-50 border-b border-slate-200 px-5 py-3 text-xs text-slate-700 shrink-0">
          <div className="flex items-start gap-2.5">
            <Info size={16} className="text-[#2F6FED] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-[#071B3A] block">Important Clinical Requirement:</span>
              <p className="text-slate-600 leading-relaxed">
                1. Download the official form below. 2. Visit an authorized registered medical doctor (MBBS/MD). 3. Affix your photo with the doctor’s stamp across the edge. 4. Upload the completed, stamped PDF copy.
              </p>
            </div>
          </div>
        </div>

        {/* Scrollable Form Content */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5">
          {/* Download Official Blank Template Box */}
          <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-[#071B3A] block">Need the official blank certificate?</span>
              <span className="text-[11px] text-slate-600">
                Official 3-Page Clinical Form with photo box and physician clearance decisions.
              </span>
            </div>
            <a
              href={SYPL_MEDICAL_DOCUMENT.downloadUrl}
              download="Shlloka_Yatra_2027_Medical_Fitness_Certificate.pdf"
              className="px-4 py-2 rounded-lg bg-[#2F6FED] hover:bg-blue-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors shrink-0"
            >
              <Download size={14} />
              <span>Download Form (PDF)</span>
            </a>
          </div>

          {/* Participant & Booking Info */}
          <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-400 block font-semibold text-[10px] uppercase">Devotee / Participant</span>
              <span className="font-bold text-slate-800">{traveller.fullName}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold text-[10px] uppercase">Booking Reference</span>
              <span className="font-bold text-slate-800 font-mono">{booking.bookingReference}</span>
            </div>
          </div>

          {/* Scanned Certificate File Upload */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Select Completed & Stamped Medical Certificate (PDF / Image) *
            </label>
            <div className="border-2 border-dashed border-slate-300 hover:border-[#2F6FED] rounded-xl p-5 text-center transition-colors cursor-pointer bg-slate-50">
              <input
                type="file"
                accept=".pdf,image/jpeg,image/png"
                onChange={handleFileChange}
                className="hidden"
                id="med-cert-file-input"
              />
              <label htmlFor="med-cert-file-input" className="cursor-pointer">
                <UploadCloud size={32} className="mx-auto text-slate-400 mb-2" />
                {selectedFile ? (
                  <div>
                    <span className="text-sm font-bold text-[#071B3A] block truncate max-w-md mx-auto">
                      {selectedFile.name}
                    </span>
                    <span className="text-xs text-slate-500">
                      ({Math.round(selectedFile.size / 1024)} KB) • Click to change
                    </span>
                  </div>
                ) : (
                  <div>
                    <span className="text-sm font-bold text-[#2F6FED] block">
                      Click to browse or drag file here
                    </span>
                    <span className="text-[11px] text-slate-400 mt-1 block">
                      PDF, JPG or PNG up to 15MB
                    </span>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Certifying Doctor Details */}
          <div className="space-y-3 pt-2 border-t border-slate-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#071B3A]">
              Certifying Doctor Details (As entered on Page 3) *
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Doctor Full Name *</label>
                <input
                  type="text"
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  placeholder="e.g. Dr. Amit K. Verma, MD"
                  required
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:border-[#2F6FED] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Registration Number & Council *
                </label>
                <input
                  type="text"
                  value={doctorRegNo}
                  onChange={(e) => setDoctorRegNo(e.target.value)}
                  placeholder="e.g. MCI / DMC 45892"
                  required
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:border-[#2F6FED] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Hospital / Clinic Name</label>
                <input
                  type="text"
                  value={doctorClinic}
                  onChange={(e) => setDoctorClinic(e.target.value)}
                  placeholder="e.g. Apollo Hospital"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:border-[#2F6FED] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Doctor Clearance Decision *</label>
                <select
                  value={doctorDecision}
                  onChange={(e) => setDoctorDecision(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:border-[#2F6FED] focus:outline-none bg-white font-semibold text-slate-800"
                >
                  <option value="FIT">1. FIT for High-Altitude Itinerary</option>
                  <option value="FIT_WITH_CONDITIONS">2. FIT ONLY WITH CONDITIONS</option>
                  <option value="NOT_FIT">3. NOT FIT for High Altitude</option>
                  <option value="DEFER">4. DEFER Decision (Further Testing)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Status / Error Message */}
          {fileError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
              <AlertTriangle size={16} className="shrink-0" />
              <span>{fileError}</span>
            </div>
          )}

          {statusMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
              <CheckCircle size={16} className="shrink-0" />
              <span>{statusMsg}</span>
            </div>
          )}

          {/* Submit Action */}
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
              <span>{submitting ? 'Uploading Securely...' : 'Upload for Verification'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
