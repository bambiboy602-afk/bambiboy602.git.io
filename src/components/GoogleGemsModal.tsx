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
  Database,
} from 'lucide-react';
import {
  GEMINI_SKILLS_COLLECTION,
  OFFICIAL_TOM_SKILL_URL,
  GEMINI_SKILLS_HUB_URL,
  NOTEBOOK_LLM_URL,
  BAMBI_PUBLIC_PHONE,
  GeminiSkillDefinition,
  SkillModeId,
} from '../data/geminiSkillsData';

interface GeminiSkillsModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeSkillId?: string;
  onSelectSkill?: (skillId: SkillModeId) => void;
  // Backwards compatibility props
  activeGemId?: string;
  onSelectGem?: (gemId: SkillModeId) => void;
}

export const GeminiSkillsModal: React.FC<GeminiSkillsModalProps> = ({
  isOpen,
  onClose,
  activeSkillId,
  onSelectSkill,
  activeGemId,
  onSelectGem,
}) => {
  const currentId = activeSkillId || activeGemId || 'tom-core';
  const selectHandler = onSelectSkill || onSelectGem;

  const [selectedSkill, setSelectedSkill] = useState<GeminiSkillDefinition>(
    GEMINI_SKILLS_COLLECTION.find((g) => g.id === currentId) || GEMINI_SKILLS_COLLECTION[0]
  );
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopyPrompt = (skill: GeminiSkillDefinition) => {
    navigator.clipboard.writeText(skill.prompt);
    setCopiedId(String(skill.id));
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
          className="w-full max-w-4xl bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-2xl overflow-hidden my-auto"
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
              <span>Gemini Skills Architecture • Maestro Runtime v1.3 Universal</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold font-serif">
              TOM Peer-Support Engine &amp; Gemini Skills Hub
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 max-w-2xl mt-1 leading-relaxed">
              Tom is the single user-facing voice operating under strict Word Economy (2–4 sentences, PAT ~0.5%). Internal modular skills coordinate via <strong>Skill 0/99 Maestro</strong>, grounded in the <strong>Master Knowledge Vault</strong> and verified Phoenix recovery resources with zero cold hotlines and an active privacy firewall.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-2.5">
              <a
                href={selectedSkill.directUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold shadow-md transition-all active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-stone-900" />
                <span>Open {selectedSkill.title} Direct Skill</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href={NOTEBOOK_LLM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/15 transition-colors"
                title="Tom & B.A.M.B.I. Master Knowledge Vault"
              >
                <BookOpen className="w-3 h-3 text-amber-300" />
                <span>NotebookLM Master Vault</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <a
                href={GEMINI_SKILLS_HUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/15 transition-colors"
              >
                <span>Gemini Skills Hub</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <a
                href="/Tom-Master-System-Specification.md"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/15 transition-colors"
              >
                <span>Master Spec v1.0</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-5 sm:p-6 space-y-6 max-h-[72vh] overflow-y-auto">
            {/* Skill Selection Tabs */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                  Select a Specialized Gemini Skill Responsibility
                </div>
                <div className="text-[10px] text-stone-500 italic">
                  Note: Skill 4 is intentionally unassigned per Master Spec
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
                {GEMINI_SKILLS_COLLECTION.map((skill) => {
                  const isSelected = selectedSkill.id === skill.id;
                  return (
                    <button
                      key={skill.id}
                      onClick={() => setSelectedSkill(skill)}
                      className={`p-3 rounded-2xl text-left border transition-all ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 dark:border-emerald-500 shadow-sm ring-2 ring-emerald-500/20'
                          : 'border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800/60'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                          {typeof skill.skillNumber === 'number' ? `Skill #${skill.skillNumber}` : skill.skillNumber}
                        </span>
                        {isSelected && (
                          <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                            <Check className="w-3 h-3" /> Active
                          </span>
                        )}
                      </div>
                      <div className="font-bold text-xs text-stone-900 dark:text-stone-100 truncate">
                        {skill.title}
                      </div>
                      <div className="text-[10.5px] text-stone-500 dark:text-stone-400 truncate">
                        {skill.subtitle}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Skill Details Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-stone-50 dark:bg-stone-800/70 border border-stone-200 dark:border-stone-700/80 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 dark:border-stone-700/60 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300/40">
                      {selectedSkill.badge}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100">
                      {selectedSkill.title}
                    </h3>
                  </div>
                  <p className="text-xs text-stone-600 dark:text-stone-400 mt-0.5">
                    {selectedSkill.role}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {selectHandler && (
                    <button
                      onClick={() => {
                        selectHandler(selectedSkill.id);
                        onClose();
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-xs transition-all active:scale-95"
                    >
                      <Radio className="w-3 h-3" />
                      <span>Activate Skill</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleCopyPrompt(selectedSkill)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-200 dark:bg-stone-700 hover:bg-stone-300 dark:hover:bg-stone-600 text-stone-800 dark:text-stone-200 text-xs font-semibold transition-colors"
                    title="Copy full skill prompt to clipboard"
                  >
                    {copiedId === String(selectedSkill.id) ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-emerald-700 dark:text-emerald-300">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Prompt</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Skill Summary */}
              <div className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed bg-white/60 dark:bg-stone-900/40 p-3.5 rounded-xl border border-stone-200/60 dark:border-stone-800">
                {selectedSkill.summary}
              </div>

              {/* Exact System Instruction Box */}
              <div>
                <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1.5">
                  <span>Canonical System Prompt &amp; Grounding</span>
                  <span>Word Economy (2–4 Sentences)</span>
                </div>
                <div className="relative">
                  <pre className="p-3.5 rounded-xl bg-stone-900 dark:bg-stone-950 text-stone-300 text-[11.5px] font-mono leading-relaxed overflow-x-auto max-h-56 border border-stone-800 whitespace-pre-wrap select-all">
                    {selectedSkill.prompt}
                  </pre>
                </div>
              </div>
            </div>

            {/* Architecture Principles Footer Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="p-3 rounded-xl bg-stone-100 dark:bg-stone-800/40 border border-stone-200/70 dark:border-stone-800">
                <div className="flex items-center gap-2 text-xs font-bold text-stone-900 dark:text-stone-100 mb-1">
                  <BrainCircuit className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>One Brain Orchestration</span>
                </div>
                <p className="text-[11px] text-stone-600 dark:text-stone-400 leading-normal">
                  Skills never compete or introduce confusing voices. Maestro coordinates internal skills so Tom always speaks as one steady presence.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-stone-100 dark:bg-stone-800/40 border border-stone-200/70 dark:border-stone-800">
                <div className="flex items-center gap-2 text-xs font-bold text-stone-900 dark:text-stone-100 mb-1">
                  <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>Privacy Quarantine Active</span>
                </div>
                <p className="text-[11px] text-stone-600 dark:text-stone-400 leading-normal">
                  Sole public line is {BAMBI_PUBLIC_PHONE}. The private personal number ending in 6251 is strictly quarantined across all channels.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-stone-100 dark:bg-stone-800/40 border border-stone-200/70 dark:border-stone-800">
                <div className="flex items-center gap-2 text-xs font-bold text-stone-900 dark:text-stone-100 mb-1">
                  <Database className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>Verified Phoenix Grid</span>
                </div>
                <p className="text-[11px] text-stone-600 dark:text-stone-400 leading-normal">
                  CASS (12th &amp; Madison), EVMC, Craig Shell, ABW, TLC, and SITD peer van numbers are verified with exact cross-streets.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// Backwards compatibility alias
export const GoogleGemsModal = GeminiSkillsModal;
