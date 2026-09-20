import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  Bot,
  BrainCircuit,
  Layers,
  ArrowRight,
  Radio,
  BookOpen,
  Phone,
  ShieldCheck,
} from 'lucide-react';
import {
  GOOGLE_GEMS_COLLECTION,
  OFFICIAL_TOM_GEM_URL,
  GEMINI_GEMS_HUB_URL,
  NOTEBOOK_LLM_URL,
  GoogleGemDefinition,
} from '../data/googleGemsData';

interface GoogleGemsModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeGemId?: string;
  onSelectGem?: (gemId: 'tom-core' | 'bambi-diagnostic' | 'the-grower') => void;
}

export const GoogleGemsModal: React.FC<GoogleGemsModalProps> = ({
  isOpen,
  onClose,
  activeGemId = 'tom-core',
  onSelectGem,
}) => {
  const [selectedGem, setSelectedGem] = useState<GoogleGemDefinition>(
    GOOGLE_GEMS_COLLECTION.find((g) => g.id === activeGemId) || GOOGLE_GEMS_COLLECTION[0]
  );
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopyPrompt = (gem: GoogleGemDefinition) => {
    navigator.clipboard.writeText(gem.prompt);
    setCopiedId(gem.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/70 backdrop-blur-xs overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-3xl bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-2xl overflow-hidden my-auto"
        >
          {/* Header Banner */}
          <div className="p-5 sm:p-6 bg-gradient-to-r from-emerald-950 via-stone-900 to-amber-950 text-white border-b border-white/10 relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Google Gemini Gems Architecture</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold font-serif">
              Tom &amp; B.A.M.B.I. 3-Gem System
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 max-w-xl mt-1 leading-relaxed">
              Official custom Gemini Gems configured for street peer recovery, real-time physical stabilization, and continuous lived-experience learning.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-2.5">
              <a
                href={OFFICIAL_TOM_GEM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold shadow-md transition-all active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-stone-900" />
                <span>Open Tom Live on Google Gem</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href={GEMINI_GEMS_HUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/15 transition-colors"
              >
                <span>Google Gems Hub</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <a
                href={NOTEBOOK_LLM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/15 transition-colors"
              >
                <BookOpen className="w-3 h-3 text-amber-300" />
                <span>NotebookLLM Vault</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-5 sm:p-6 space-y-6 max-h-[72vh] overflow-y-auto">
            {/* Gem Selection Tabs */}
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2">
                Select a Specialized Google Gem
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {GOOGLE_GEMS_COLLECTION.map((gem) => {
                  const isSelected = selectedGem.id === gem.id;
                  return (
                    <button
                      key={gem.id}
                      onClick={() => setSelectedGem(gem)}
                      className={`p-3 rounded-2xl text-left border transition-all ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 dark:border-emerald-500 shadow-sm ring-2 ring-emerald-500/20'
                          : 'border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800/60'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                          Gem #{gem.gemNumber}
                        </span>
                        {isSelected && (
                          <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                            <Check className="w-3 h-3" /> Active
                          </span>
                        )}
                      </div>
                      <div className="font-bold text-xs text-stone-900 dark:text-stone-100">
                        {gem.title}
                      </div>
                      <div className="text-[10.5px] text-stone-500 dark:text-stone-400 truncate">
                        {gem.subtitle}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Gem Details Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-stone-50 dark:bg-stone-800/70 border border-stone-200 dark:border-stone-700/80 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200 dark:border-stone-700">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                      Gem #{selectedGem.gemNumber} • {selectedGem.badge}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 mt-1">
                    {selectedGem.title}: {selectedGem.subtitle}
                  </h3>
                  <p className="text-xs text-stone-600 dark:text-stone-300 mt-0.5">
                    {selectedGem.role}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {onSelectGem && (
                    <button
                      onClick={() => {
                        onSelectGem(selectedGem.id);
                        onClose();
                      }}
                      className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all"
                    >
                      Use in Avatar
                    </button>
                  )}
                  <button
                    onClick={() => handleCopyPrompt(selectedGem)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-200 dark:bg-stone-700 hover:bg-stone-300 dark:hover:bg-stone-600 text-stone-800 dark:text-stone-200 text-xs font-bold transition-colors"
                  >
                    {copiedId === selectedGem.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Copied Prompt!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Gem Prompt</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                {selectedGem.summary}
              </div>

              {/* Exact Google Gem System Prompt Box */}
              <div>
                <div className="flex items-center justify-between text-[11px] font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                  <span>Exact Gemini Gem Instruction (From Master Source):</span>
                  <span className="text-[10px] text-stone-500">Ready for Google AI Studio / Gemini Advanced</span>
                </div>
                <div className="p-3.5 rounded-xl bg-stone-900 text-stone-200 font-mono text-[11px] leading-relaxed max-h-56 overflow-y-auto whitespace-pre-wrap border border-stone-800 selection:bg-emerald-500 selection:text-white">
                  {selectedGem.prompt}
                </div>
              </div>
            </div>

            {/* NotebookLLM & Single Source Grounding Reference */}
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 dark:text-amber-300">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <span>Single Source of Truth Grounding</span>
                </div>
                <p className="text-[11.5px] text-stone-600 dark:text-stone-300">
                  All 3 Google Gems and the on-site Tom avatar are unified and grounded in <code>Tom-Core-Sourcefile-Master.md</code>.
                </p>
              </div>

              <a
                href="/Tom-Core-Sourcefile-Master.md"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white dark:bg-stone-800 hover:bg-stone-100 text-stone-900 dark:text-stone-100 text-xs font-bold border border-amber-300 dark:border-amber-800 shrink-0 transition-colors"
              >
                <span>View Master Source (.md)</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 bg-stone-100 dark:bg-stone-950 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between">
            <div className="text-[11px] text-stone-500 dark:text-stone-400">
              Built &amp; directed by Bambi (602-767-2147 • Phoenix, AZ)
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-900 text-xs font-bold transition-colors"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
