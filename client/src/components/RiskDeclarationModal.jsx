import React, { useState } from 'react';
import {
  ShieldAlert,
  FileText,
  Download,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  AlertTriangle,
  Lock,
  X,
  UserCheck,
} from 'lucide-react';
import { SYPL_RISK_DOCUMENT } from '../data/officialDocuments';

export default function RiskDeclarationModal({
  isOpen,
  onClose,
  participantData,
  onDeclarationSigned,
  initialData = null,
  readOnly = false,
}) {
  if (!isOpen) return null;

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5;

  // 5 Page Initials
  const [pageInitials, setPageInitials] = useState(
    initialData?.pageInitials || ['', '', '', '', '']
  );

  // 8 Direct Acknowledgements (Section 8)
  const [acknowledgements, setAcknowledgements] = useState(
    initialData?.acknowledgements || {
      ack1_extreme_altitude: false,
      ack2_medical_conditions: false,
      ack3_insurance_mandatory: false,
      ack4_leader_authority: false,
      ack5_evacuation_costs: false,
      ack6_uncertainties: false,
      ack7_limited_indemnity: false,
      ack8_read_all_pages: false,
    }
  );

  // Execution Details (Section 10)
  const [signerName, setSignerName] = useState(
    initialData?.signerName || participantData?.fullName || ''
  );
  const [signerRelationship, setSignerRelationship] = useState(
    initialData?.signerRelationship || 'SELF'
  );
  const [signaturePlace, setSignaturePlace] = useState(
    initialData?.signaturePlace || participantData?.city || 'Kathmandu, Nepal'
  );
  const [signatureDate] = useState(
    initialData?.signatureDate || new Date().toISOString().split('T')[0]
  );
  const [witnessName, setWitnessName] = useState(initialData?.witnessName || '');
  const [witnessPhone, setWitnessPhone] = useState(initialData?.witnessPhone || '');

  const [errorMsg, setErrorMsg] = useState('');

  const handleInitialChange = (pageIndex, val) => {
    const updated = [...pageInitials];
    updated[pageIndex] = val.toUpperCase().slice(0, 5);
    setPageInitials(updated);
  };

  const handleAckToggle = (key) => {
    if (readOnly) return;
    setAcknowledgements((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleConfirmSignature = () => {
    // 1. Validate all 5 initials
    for (let i = 0; i < 5; i++) {
      if (!pageInitials[i] || !pageInitials[i].trim()) {
        setErrorMsg(`Please enter your participant initials on Page ${i + 1} before proceeding.`);
        setCurrentPage(i + 1);
        return;
      }
    }

    // 2. Validate all 8 acknowledgements
    for (const ack of SYPL_RISK_DOCUMENT.directAcknowledgements) {
      if (!acknowledgements[ack.id]) {
        setErrorMsg(`You must affirmatively acknowledge statement #${ack.statementNumber} on Page 5.`);
        setCurrentPage(5);
        return;
      }
    }

    // 3. Validate signer name & place
    if (!signerName.trim()) {
      setErrorMsg('Please enter your full legal signature name.');
      setCurrentPage(5);
      return;
    }
    if (!signaturePlace.trim()) {
      setErrorMsg('Please enter your signing city and country.');
      setCurrentPage(5);
      return;
    }

    setErrorMsg('');
    const signedData = {
      documentRef: SYPL_RISK_DOCUMENT.documentRef,
      version: SYPL_RISK_DOCUMENT.version,
      pageInitials,
      acknowledgements,
      signerName: signerName.trim(),
      signerRelationship,
      signaturePlace: signaturePlace.trim(),
      signatureDate,
      witnessName: witnessName.trim() || null,
      witnessPhone: witnessPhone.trim() || null,
      signedAt: new Date().toISOString(),
    };

    if (onDeclarationSigned) {
      onDeclarationSigned(signedData);
    }
  };

  const currentPageData = SYPL_RISK_DOCUMENT.pages.find((p) => p.pageNumber === currentPage);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="bg-[#071B3A] text-white px-5 py-4 flex items-center justify-between border-b border-amber-500/30 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <ShieldAlert size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  {SYPL_RISK_DOCUMENT.documentRef}
                </span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-blue-500/20 text-blue-200">
                  {SYPL_RISK_DOCUMENT.version}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold font-heading text-white mt-0.5 leading-tight">
                Participant Declaration & Limited Indemnity Agreement
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={SYPL_RISK_DOCUMENT.downloadUrl}
              download="Shlloka_Yatra_2027_Risk_Declaration_and_Indemnity.pdf"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors"
              title="Download official PDF draft"
            >
              <Download size={14} />
              <span>Download PDF</span>
            </a>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Draft Notice Banner */}
        <div className="bg-amber-50 border-b border-amber-200 px-5 py-2 text-xs text-amber-900 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <AlertTriangle size={15} className="text-amber-600 shrink-0" />
            <span>
              <strong>Draft Version 1.0 (23 Nov 2026):</strong> Review and initial all 5 pages. All 24 statutory clauses preserved.
            </span>
          </div>
          <span className="text-[11px] text-amber-700 font-medium">Page {currentPage} of {totalPages}</span>
        </div>

        {/* Page Stepper Navigation */}
        <div className="bg-slate-100 px-5 py-2.5 border-b border-slate-200 flex items-center justify-between shrink-0 overflow-x-auto gap-2">
          <div className="flex items-center gap-1.5 sm:gap-2">
            {[1, 2, 3, 4, 5].map((pageNum) => {
              const isDone = Boolean(pageInitials[pageNum - 1]?.trim());
              const isCurrent = currentPage === pageNum;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                    isCurrent
                      ? 'bg-[#071B3A] text-white shadow-sm'
                      : isDone
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                      : 'bg-white text-slate-600 border border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {isDone && <CheckCircle size={12} className="text-emerald-600" />}
                  <span>Page {pageNum}</span>
                  {pageInitials[pageNum - 1] && (
                    <span className="text-[10px] opacity-75 font-mono">({pageInitials[pageNum - 1]})</span>
                  )}
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-300 text-slate-600 disabled:opacity-40 hover:bg-white"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(5, p + 1))}
              disabled={currentPage === 5}
              className="p-1.5 rounded-lg border border-slate-300 text-slate-600 disabled:opacity-40 hover:bg-white"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Scrollable Document Content Area */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 text-slate-800 font-sans space-y-6">
          <div className="border-b border-slate-200 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2F6FED]">
              Official Document Schedule • {currentPageData?.pageTitle}
            </span>
            <h3 className="text-lg font-bold text-[#071B3A] mt-0.5">
              Shlloka Yatra 2027 — High-Altitude Expedition Risk Terms
            </h3>
          </div>

          {/* Sections on this page */}
          {currentPageData?.sections.map((section) => (
            <div key={section.sectionNumber} className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-[#071B3A] text-white text-xs font-bold flex items-center justify-center">
                  {section.sectionNumber}
                </span>
                <h4 className="text-sm sm:text-base font-bold text-[#071B3A]">
                  {section.sectionTitle}
                </h4>
              </div>

              <div className="grid gap-3">
                {section.clauses.map((clause) => (
                  <div
                    key={clause.clauseNumber}
                    className="p-3.5 sm:p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-[#2F6FED] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        Clause {clause.clauseNumber}
                      </span>
                      <h5 className="text-xs sm:text-sm font-bold text-slate-900">{clause.title}</h5>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed text-justify">
                      {clause.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Page 5 Special Sections: Section 8 Direct Acknowledgements, Emergency Contact, and Execution */}
          {currentPage === 5 && (
            <div className="space-y-6 pt-4 border-t border-slate-200">
              {/* Section 8: Direct Acknowledgements */}
              <div className="bg-amber-50/60 border border-amber-300 rounded-xl p-4 sm:p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-6 h-6 rounded-md bg-amber-600 text-white text-xs font-bold flex items-center justify-center">
                    08
                  </span>
                  <h4 className="text-sm sm:text-base font-bold text-[#071B3A]">
                    Section 8: Direct Acknowledgements — Initial Each Statement
                  </h4>
                </div>
                <p className="text-xs text-slate-600 mb-4">
                  Please affirmatively acknowledge each individual statement below by checking the corresponding box.
                </p>

                <div className="space-y-2.5">
                  {SYPL_RISK_DOCUMENT.directAcknowledgements.map((ack) => (
                    <label
                      key={ack.id}
                      className={`p-3 rounded-lg border flex items-start gap-3 cursor-pointer transition-colors ${
                        acknowledgements[ack.id]
                          ? 'bg-emerald-50/60 border-emerald-300'
                          : 'bg-white border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={acknowledgements[ack.id]}
                        onChange={() => handleAckToggle(ack.id)}
                        disabled={readOnly}
                        className="mt-0.5 w-4 h-4 text-[#2F6FED] rounded border-slate-300 focus:ring-0 shrink-0"
                      />
                      <div className="text-xs sm:text-sm text-slate-800 leading-relaxed">
                        <span className="font-bold text-[#071B3A] mr-1.5">Statement {ack.statementNumber}:</span>
                        <span>{ack.text}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Section 9: Emergency Contact & High-Altitude Insurance Summary */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-[#071B3A] text-white text-xs font-bold flex items-center justify-center">
                    09
                  </span>
                  <h4 className="text-sm sm:text-base font-bold text-[#071B3A]">
                    Section 9: Emergency Contact & High-Altitude Insurance Record
                  </h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <span className="text-slate-500 block text-[11px] font-semibold">Participant Full Name</span>
                    <span className="font-bold text-slate-800">{participantData?.fullName || signerName || 'Primary Devotee'}</span>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <span className="text-slate-500 block text-[11px] font-semibold">Passport Number</span>
                    <span className="font-bold text-slate-800">{participantData?.passportNumber || 'Recorded in Booking'}</span>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <span className="text-slate-500 block text-[11px] font-semibold">Emergency Contact</span>
                    <span className="font-bold text-slate-800">
                      {participantData?.emergencyContactName || 'Family Contact'} ({participantData?.emergencyContactPhone || 'Recorded in Booking'})
                    </span>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <span className="text-slate-500 block text-[11px] font-semibold">High-Altitude Insurance</span>
                    <span className="font-bold text-slate-800">
                      {participantData?.insuranceProvider || 'Mandatory Policy to be Uploaded'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Section 10: Participant Execution & Signature */}
              <div className="bg-[#071B3A] text-white rounded-xl p-5 sm:p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <UserCheck className="text-amber-400" size={20} />
                  <h4 className="text-base font-bold text-white font-heading">
                    Section 10: Execution by the Participant (Digital Signature)
                  </h4>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  By executing this section, I solemnly declare that I have read all 5 pages and 24 clauses, have initialed each page, have acknowledged Section 8, and freely enter into this agreement with Shloka Yatra Private Limited.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-200 mb-1">
                      Legal Full Name as Signature *
                    </label>
                    <input
                      type="text"
                      value={signerName}
                      onChange={(e) => setSignerName(e.target.value)}
                      disabled={readOnly}
                      placeholder="e.g. Ramesh Chandra Sharma"
                      className="w-full px-3 py-2.5 rounded-lg bg-slate-900/80 border border-slate-700 text-white text-sm focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-200 mb-1">
                      Signing City & Country *
                    </label>
                    <input
                      type="text"
                      value={signaturePlace}
                      onChange={(e) => setSignaturePlace(e.target.value)}
                      disabled={readOnly}
                      placeholder="e.g. New Delhi, India"
                      className="w-full px-3 py-2.5 rounded-lg bg-slate-900/80 border border-slate-700 text-white text-sm focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-200 mb-1">Execution Date</label>
                    <input
                      type="text"
                      value={signatureDate}
                      readOnly
                      className="w-full px-3 py-2.5 rounded-lg bg-slate-900/40 border border-slate-800 text-slate-400 text-sm cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-200 mb-1">Relationship to Traveller</label>
                    <select
                      value={signerRelationship}
                      onChange={(e) => setSignerRelationship(e.target.value)}
                      disabled={readOnly}
                      className="w-full px-3 py-2.5 rounded-lg bg-slate-900/80 border border-slate-700 text-white text-sm focus:border-amber-400 focus:outline-none"
                    >
                      <option value="SELF">Self (Participant)</option>
                      <option value="LEGAL_GUARDIAN">Legal Guardian</option>
                      <option value="SPOUSE">Spouse / Next of Kin</option>
                    </select>
                  </div>
                </div>

                {/* Optional Witness Details */}
                <div className="pt-2 border-t border-slate-800">
                  <span className="block text-xs text-slate-400 font-semibold mb-2">
                    Optional Witness Details (Recommended per clause 22):
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={witnessName}
                      onChange={(e) => setWitnessName(e.target.value)}
                      disabled={readOnly}
                      placeholder="Witness Full Name (Optional)"
                      className="w-full px-3 py-2 rounded-lg bg-slate-900/60 border border-slate-800 text-slate-200 text-xs focus:border-slate-500 focus:outline-none"
                    />
                    <input
                      type="text"
                      value={witnessPhone}
                      onChange={(e) => setWitnessPhone(e.target.value)}
                      disabled={readOnly}
                      placeholder="Witness Contact Phone (Optional)"
                      className="w-full px-3 py-2 rounded-lg bg-slate-900/60 border border-slate-800 text-slate-200 text-xs focus:border-slate-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Current Page Initials Box */}
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-amber-900 block">
                Page {currentPage} Participant Initials Requirement *
              </span>
              <span className="text-[11px] text-amber-700">
                Per Section 3.4 of the official document, each page must be initialed by the participant.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-slate-700">Initials:</label>
              <input
                type="text"
                value={pageInitials[currentPage - 1] || ''}
                onChange={(e) => handleInitialChange(currentPage - 1, e.target.value)}
                disabled={readOnly}
                placeholder="e.g. RS"
                maxLength={5}
                className="w-20 px-3 py-1.5 rounded-lg border border-amber-400 bg-white text-center font-mono font-bold text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 uppercase"
              />
            </div>
          </div>
        </div>

        {/* Error notification if any */}
        {errorMsg && (
          <div className="px-5 py-2.5 bg-red-100 border-t border-red-200 text-red-800 text-xs font-semibold flex items-center gap-2">
            <AlertTriangle size={15} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Footer Actions */}
        <div className="bg-slate-100 px-5 py-3.5 border-t border-slate-200 flex flex-col-reverse sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs disabled:opacity-40 hover:bg-white transition-colors"
            >
              Previous Page
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(5, p + 1))}
              disabled={currentPage === 5}
              className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs disabled:opacity-40 hover:bg-white transition-colors"
            >
              Next Page
            </button>
          </div>

          {!readOnly && (
            <button
              onClick={handleConfirmSignature}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#071B3A] hover:bg-slate-900 text-amber-300 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all border border-amber-500/50"
            >
              <CheckCircle size={16} className="text-amber-400" />
              <span>Confirm & Complete Risk Declaration</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
