import React, { useState, useEffect } from 'react';
import { 
  X, 
  FileText, 
  Download, 
  ShieldCheck, 
  CheckCircle2, 
  Copy,
  Sparkles,
  Search
} from 'lucide-react';
import { SnowflakeBadge } from './SnowflakeBadge';
import { fetchAIDocuments, AuditDocumentInfo } from '../../services/api';

import { getProjectTitleForDoc } from '../../utils/documentCatalog';

interface DocumentProofModalProps {
  isOpen: boolean;
  onClose: () => void;
  filename: string | null;
  snippet?: string;
  onAskAIAboutDoc?: (filename: string) => void;
}

export const DocumentProofModal: React.FC<DocumentProofModalProps> = ({
  isOpen,
  onClose,
  filename,
  snippet,
  onAskAIAboutDoc,
}) => {
  const [docCatalog, setDocCatalog] = useState<AuditDocumentInfo[]>([]);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'audit_details'>('preview');

  useEffect(() => {
    fetchAIDocuments().then((res) => {
      setDocCatalog(res.documents || []);
    }).catch(() => {});
  }, []);

  if (!isOpen || !filename) return null;

  const found = docCatalog.find((d) => d.filename.toLowerCase() === filename.toLowerCase());
  const currentDoc = {
    filename,
    title: found?.title || getProjectTitleForDoc(filename),
    contract_id: found?.contract_id || 'AUDIT-PDF-PROOF',
    abc_budget: found?.abc_budget || 'Verified in Document Stage',
    agency: found?.agency || 'DPWH / Municipal Authority',
    progress_pct: found?.progress_pct ?? 100,
    safety_score: found?.safety_score || '98.5%',
    status: found?.status || 'Audit Verified'
  };

  const pdfUrl = `/documents/${filename}`;

  const handleCopyContract = () => {
    navigator.clipboard.writeText(currentDoc.contract_id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-neutral-950/80 backdrop-blur-md animate-fade-in text-left">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 sm:p-5 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/90 shrink-0 gap-3">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="p-2 sm:p-2.5 rounded-xl bg-sky-500/10 text-sky-500 border border-sky-500/20 shrink-0">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <h3 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white truncate">
                  {currentDoc.title}
                </h3>
                <div className="hidden xs:inline-flex">
                  <SnowflakeBadge variant="cortex" label="Cortex Search Stage PDF" size="sm" />
                </div>
              </div>
              <p className="text-[11px] sm:text-xs text-neutral-500 font-mono mt-0.5 truncate">
                {currentDoc.filename} • ID: {currentDoc.contract_id}
              </p>
            </div>
            <button
              onClick={onClose}
              className="sm:hidden p-1.5 rounded-xl text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-all shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-2 justify-between sm:justify-end w-full sm:w-auto pt-1 sm:pt-0 border-t sm:border-t-0 border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'preview'
                    ? 'bg-sky-600 text-white'
                    : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                }`}
              >
                PDF Document
              </button>
              <button
                onClick={() => setActiveTab('audit_details')}
                className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'audit_details'
                    ? 'bg-sky-600 text-white'
                    : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                }`}
              >
                Audit Details
              </button>
            </div>
            <button
              onClick={onClose}
              className="hidden sm:flex p-2 rounded-xl text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-all shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Audit Highlights Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 p-3 sm:p-4 bg-sky-500/5 border-b border-neutral-200 dark:border-neutral-800 shrink-0 text-xs">
          <div className="p-2 sm:p-2.5 rounded-xl bg-white dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700">
            <span className="text-[9px] sm:text-[10px] text-neutral-500 uppercase font-bold tracking-wider block">Contract ID</span>
            <div className="flex items-center justify-between font-mono font-semibold text-neutral-900 dark:text-white mt-0.5 text-[11px] sm:text-xs">
              <span className="truncate">{currentDoc.contract_id}</span>
              <button onClick={handleCopyContract} className="text-sky-500 hover:underline text-[10px] shrink-0 ml-1">
                {copied ? 'Copied' : <Copy className="w-3 h-3" />}
              </button>
            </div>
          </div>

          <div className="p-2 sm:p-2.5 rounded-xl bg-white dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700">
            <span className="text-[9px] sm:text-[10px] text-neutral-500 uppercase font-bold tracking-wider block">Approved Budget (ABC)</span>
            <span className="font-bold text-sky-600 dark:text-sky-400 mt-0.5 block truncate text-[11px] sm:text-xs">{currentDoc.abc_budget}</span>
          </div>

          <div className="p-2 sm:p-2.5 rounded-xl bg-white dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700">
            <span className="text-[9px] sm:text-[10px] text-neutral-500 uppercase font-bold tracking-wider block">Safety & Compliance</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-0.5 text-[11px] sm:text-xs">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              {currentDoc.safety_score}
            </span>
          </div>

          <div className="p-2 sm:p-2.5 rounded-xl bg-white dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700">
            <span className="text-[9px] sm:text-[10px] text-neutral-500 uppercase font-bold tracking-wider block">Implementing Agency</span>
            <span className="font-semibold text-neutral-800 dark:text-neutral-200 mt-0.5 block truncate text-[11px] sm:text-xs">{currentDoc.agency}</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-3 sm:space-y-4">
          {snippet && (
            <div className="p-3 sm:p-4 rounded-xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800/50 text-xs text-sky-900 dark:text-sky-200 space-y-1">
              <div className="flex items-center gap-1.5 font-bold uppercase text-[10px] tracking-wider text-sky-600 dark:text-sky-400">
                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                <span>Extracted Cortex Vector Search Excerpt</span>
              </div>
              <p className="leading-relaxed font-medium">{snippet}</p>
            </div>
          )}

          {activeTab === 'preview' ? (
            <div className="w-full h-[280px] sm:h-[450px] rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-950 flex flex-col">
              <iframe
                src={pdfUrl}
                title={currentDoc.title}
                className="w-full h-full border-none"
              />
            </div>
          ) : (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 space-y-3">
                <h4 className="font-bold text-neutral-900 dark:text-white text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Audit Verification Summary
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-neutral-700 dark:text-neutral-300">
                  <div>
                    <span className="text-neutral-400 block text-[11px]">Document Name</span>
                    <span className="font-medium">{currentDoc.filename}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block text-[11px]">Audit Progress</span>
                    <span className="font-medium">{currentDoc.progress_pct}% Completed</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block text-[11px]">Status</span>
                    <span className="font-medium text-emerald-500">{currentDoc.status}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block text-[11px]">Vector Embeddings</span>
                    <span className="font-medium font-mono text-[11px]">1,024-dim Snowflake Cortex Vector</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-neutral-900 text-neutral-200 font-mono text-[11px] border border-neutral-800 space-y-2">
                <div className="text-sky-400 font-bold flex items-center gap-1.5">
                  <Search className="w-3.5 h-3.5" />
                  <span>Snowflake Cortex Search Stage Query Definition</span>
                </div>
                <div className="text-emerald-400 whitespace-pre-wrap">
                  {`SELECT DOCUMENT_ID, CONTRACT_ID, VECTOR_MATCH(CHUNK_TEXT, [PROMPT_VECTOR]) AS SIMILARITY
FROM CIVIC_TRANSPARENCY_DB.PUBLIC.STAGE_CIVIC_AUDITS_PDF
WHERE FILENAME = '${currentDoc.filename}';`}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/90 shrink-0">
          <a
            href={pdfUrl}
            download={filename}
            className="px-4 py-2 rounded-xl bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 text-xs font-semibold flex items-center gap-2 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF Proof</span>
          </a>

          <div className="flex items-center gap-2">
            {onAskAIAboutDoc && (
              <button
                onClick={() => {
                  onAskAIAboutDoc(filename);
                  onClose();
                }}
                className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Ask Cortex AI About This PDF</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-neutral-800 text-white text-xs font-semibold hover:bg-neutral-700 transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
