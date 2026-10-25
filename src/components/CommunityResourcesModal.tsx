import React, { useState } from 'react';
import {
  X,
  Home,
  Briefcase,
  HeartHandshake,
  Scale,
  FileText,
  Download,
  ExternalLink,
  Search,
  Phone,
  MapPin,
  CheckCircle2,
  Building2,
  AlertCircle,
  HelpCircle,
  ArrowUpRight,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Activity,
  Layers,
  BookOpen,
} from 'lucide-react';
import {
  HOUSING_RESOURCES,
  APPRENTICESHIP_RESOURCES,
  HEALTH_RESOURCES,
  LEGAL_RESOURCES,
  PILLAR_RESOURCE_COUNTS,
  RecoveryHousingItem,
  ApprenticeshipItem,
  HealthResourceItem,
  LegalResourceItem,
} from '../data/communityResourcesData';
import { NOTEBOOK_LLM_URL } from '../data/googleGemsData';

export type PillarTab = 'housing' | 'work' | 'treatment' | 'legal';

interface CommunityResourcesModalProps {
  isOpen: boolean;
  initialTab?: PillarTab;
  onClose: () => void;
  onOpenTomAI?: () => void;
}

export const CommunityResourcesModal: React.FC<CommunityResourcesModalProps> = ({
  isOpen,
  initialTab = 'housing',
  onClose,
  onOpenTomAI,
}) => {
  const [activeTab, setActiveTab] = useState<PillarTab>(initialTab);
  const [housingSearch, setHousingSearch] = useState('');
  const [housingFilter, setHousingFilter] = useState<'All' | 'Halfway House' | 'Emergency Shelter' | 'Residential / BHRF' | 'Crisis Respite' | 'No Income'>('All');
  const [workSearch, setWorkSearch] = useState('');
  const [workTradeFilter, setWorkTradeFilter] = useState<string>('All');
  const [workOnlyAccepting, setWorkOnlyAccepting] = useState(false);
  const [healthSearch, setHealthSearch] = useState('');
  const [healthFilter, setHealthFilter] = useState<string>('All');
  const [legalSearch, setLegalSearch] = useState('');
  const [legalFilter, setLegalFilter] = useState<string>('All');
  const [showHowToGiveDocs, setShowHowToGiveDocs] = useState(false);

  // Sync tab if initialTab changes
  React.useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  // Filter Housing items (Pillar 1)
  const filteredHousing = HOUSING_RESOURCES.filter((item: RecoveryHousingItem) => {
    const matchesSearch =
      item.name.toLowerCase().includes(housingSearch.toLowerCase()) ||
      item.location.toLowerCase().includes(housingSearch.toLowerCase()) ||
      item.city.toLowerCase().includes(housingSearch.toLowerCase()) ||
      (item.contactNotes && item.contactNotes.toLowerCase().includes(housingSearch.toLowerCase()));

    if (housingFilter === 'No Income') {
      return matchesSearch && item.noIncomeRequired === true;
    }
    if (housingFilter !== 'All') {
      return matchesSearch && item.category === housingFilter;
    }
    return matchesSearch;
  });

  // Filter Apprenticeship / Employment items (Pillar 3)
  const filteredWork = APPRENTICESHIP_RESOURCES.filter((item: ApprenticeshipItem) => {
    const q = workSearch.toLowerCase();
    const matchesSearch =
      item.occupation.toLowerCase().includes(q) ||
      item.sponsorName.toLowerCase().includes(q) ||
      item.sponsorCity.toLowerCase().includes(q) ||
      item.sponsorCounty.toLowerCase().includes(q);

    const matchesAccepting = workOnlyAccepting ? item.acceptingApplications : true;
    if (!matchesSearch || !matchesAccepting) return false;

    if (workTradeFilter === 'Electrical') {
      return item.occupation.toLowerCase().includes('electric') || item.occupation.toLowerCase().includes('lineman') || item.occupation.toLowerCase().includes('substation');
    }
    if (workTradeFilter === 'Plumbing & Pipe') {
      return item.occupation.toLowerCase().includes('plumb') || item.occupation.toLowerCase().includes('pipe');
    }
    if (workTradeFilter === 'Carpentry & Millwright') {
      return item.occupation.toLowerCase().includes('carpent') || item.occupation.toLowerCase().includes('millwright') || item.occupation.toLowerCase().includes('glazier') || item.occupation.toLowerCase().includes('cement');
    }
    if (workTradeFilter === 'Steel & Iron') {
      return item.occupation.toLowerCase().includes('iron') || item.occupation.toLowerCase().includes('steel') || item.occupation.toLowerCase().includes('sheet metal') || item.occupation.toLowerCase().includes('boilermaker');
    }
    if (workTradeFilter === 'Heavy Equipment') {
      return item.occupation.toLowerCase().includes('heavy equipment') || item.occupation.toLowerCase().includes('paving') || item.occupation.toLowerCase().includes('operating') || item.occupation.toLowerCase().includes('surveyor');
    }

    return true;
  });

  // Filter Health & Detox items (Pillar 2)
  const filteredHealth = HEALTH_RESOURCES.filter((item: HealthResourceItem) => {
    const q = healthSearch.toLowerCase();
    const matchesSearch =
      item.name.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.city.toLowerCase().includes(q) ||
      item.location.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.funding.toLowerCase().includes(q) ||
      (item.urgentService && item.urgentService.toLowerCase().includes(q));

    if (healthFilter !== 'All') {
      return matchesSearch && item.category === healthFilter;
    }
    return matchesSearch;
  });

  // Filter Legal & Re-Entry items (Pillar 4)
  const filteredLegal = LEGAL_RESOURCES.filter((item: LegalResourceItem) => {
    const q = legalSearch.toLowerCase();
    const matchesSearch =
      item.name.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.city.toLowerCase().includes(q) ||
      item.serviceSummary.toLowerCase().includes(q) ||
      item.stepsToAccess.toLowerCase().includes(q);

    if (legalFilter !== 'All') {
      return matchesSearch && item.category === legalFilter;
    }
    return matchesSearch;
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-stone-900 rounded-3xl max-w-4xl w-full border border-stone-200 dark:border-stone-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-600 text-white flex items-center justify-center font-bold shadow-sm">
              {activeTab === 'housing' && <Home className="w-5 h-5" />}
              {activeTab === 'work' && <Briefcase className="w-5 h-5" />}
              {activeTab === 'treatment' && <HeartHandshake className="w-5 h-5" />}
              {activeTab === 'legal' && <Scale className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-stone-900 dark:text-stone-100 font-serif">
                4 Pillars of Direct Support
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Verified Community Directories & Direct Official PDF Documents
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowHowToGiveDocs(!showHowToGiveDocs)}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-200/80 dark:bg-stone-800 hover:bg-stone-300 text-stone-700 dark:text-stone-300 text-xs font-semibold transition-colors"
              title="How to manage documents"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
              <span>How Docs Work</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-stone-200/70 dark:hover:bg-stone-800 text-stone-400 hover:text-stone-800 dark:hover:text-stone-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Small Counter Display: 4 Pillars Resource Density Gauge */}
        <div className="px-3 sm:px-5 py-2.5 bg-stone-100/90 dark:bg-stone-950/70 border-b border-stone-200 dark:border-stone-800">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>Pillar Resource Density</span>
              </span>
              <span className="hidden sm:inline text-[10px] text-stone-400 dark:text-stone-500">
                • Verified Arizona Directories
              </span>
            </div>
            <div className="text-[11px] font-mono font-bold text-stone-700 dark:text-stone-300 bg-stone-200/90 dark:bg-stone-800 px-2.5 py-0.5 rounded-full border border-stone-300/60 dark:border-stone-700 shadow-2xs">
              Density Total: <span className="text-amber-600 dark:text-amber-400 font-extrabold">{PILLAR_RESOURCE_COUNTS.total}</span> Resources
            </div>
          </div>

          {/* 4 Counter Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {/* Housing Pillar Counter */}
            <button
              type="button"
              onClick={() => setActiveTab('housing')}
              className={`text-left p-2.5 rounded-2xl border transition-all relative group cursor-pointer ${
                activeTab === 'housing'
                  ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 ring-2 ring-emerald-500/25 shadow-sm'
                  : 'bg-white dark:bg-stone-900/90 border-stone-200/90 dark:border-stone-800 hover:border-emerald-300 dark:hover:border-emerald-800/60 hover:bg-emerald-50/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
                  <Home className="w-3.5 h-3.5 shrink-0" />
                  <span className="text-xs font-bold">Housing</span>
                </div>
                <span className="text-base font-extrabold font-mono text-emerald-800 dark:text-emerald-300">
                  {PILLAR_RESOURCE_COUNTS.housing}
                </span>
              </div>
              <div className="flex items-center justify-between mt-1 text-[10px] text-stone-500 dark:text-stone-400">
                <span>Sober &amp; Shelters</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400 font-mono">Pillar 1</span>
              </div>
            </button>

            {/* Health Pillar Counter */}
            <button
              type="button"
              onClick={() => setActiveTab('treatment')}
              className={`text-left p-2.5 rounded-2xl border transition-all relative group cursor-pointer ${
                activeTab === 'treatment'
                  ? 'bg-rose-50 dark:bg-rose-950/50 border-rose-500 ring-2 ring-rose-500/25 shadow-sm'
                  : 'bg-white dark:bg-stone-900/90 border-stone-200/90 dark:border-stone-800 hover:border-rose-300 dark:hover:border-rose-800/60 hover:bg-rose-50/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-rose-700 dark:text-rose-400">
                  <HeartHandshake className="w-3.5 h-3.5 shrink-0" />
                  <span className="text-xs font-bold">Health</span>
                </div>
                <span className="text-base font-extrabold font-mono text-rose-800 dark:text-rose-300">
                  {PILLAR_RESOURCE_COUNTS.health}
                </span>
              </div>
              <div className="flex items-center justify-between mt-1 text-[10px] text-stone-500 dark:text-stone-400">
                <span>Detox &amp; Crisis</span>
                <span className="font-semibold text-rose-600 dark:text-rose-400 font-mono">Pillar 2</span>
              </div>
            </button>

            {/* Employment Pillar Counter */}
            <button
              type="button"
              onClick={() => setActiveTab('work')}
              className={`text-left p-2.5 rounded-2xl border transition-all relative group cursor-pointer ${
                activeTab === 'work'
                  ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-500 ring-2 ring-amber-500/25 shadow-sm'
                  : 'bg-white dark:bg-stone-900/90 border-stone-200/90 dark:border-stone-800 hover:border-amber-300 dark:hover:border-amber-800/60 hover:bg-amber-50/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400">
                  <Briefcase className="w-3.5 h-3.5 shrink-0" />
                  <span className="text-xs font-bold">Employment</span>
                </div>
                <span className="text-base font-extrabold font-mono text-amber-800 dark:text-amber-300">
                  {PILLAR_RESOURCE_COUNTS.employment}
                </span>
              </div>
              <div className="flex items-center justify-between mt-1 text-[10px] text-stone-500 dark:text-stone-400">
                <span>Apprenticeships</span>
                <span className="font-semibold text-amber-600 dark:text-amber-400 font-mono">Pillar 3</span>
              </div>
            </button>

            {/* Legal Pillar Counter */}
            <button
              type="button"
              onClick={() => setActiveTab('legal')}
              className={`text-left p-2.5 rounded-2xl border transition-all relative group cursor-pointer ${
                activeTab === 'legal'
                  ? 'bg-blue-50 dark:bg-blue-950/50 border-blue-500 ring-2 ring-blue-500/25 shadow-sm'
                  : 'bg-white dark:bg-stone-900/90 border-stone-200/90 dark:border-stone-800 hover:border-blue-300 dark:hover:border-blue-800/60 hover:bg-blue-50/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-blue-700 dark:text-blue-400">
                  <Scale className="w-3.5 h-3.5 shrink-0" />
                  <span className="text-xs font-bold">Legal</span>
                </div>
                <span className="text-base font-extrabold font-mono text-blue-800 dark:text-blue-300">
                  {PILLAR_RESOURCE_COUNTS.legal}
                </span>
              </div>
              <div className="flex items-center justify-between mt-1 text-[10px] text-stone-500 dark:text-stone-400">
                <span>Warrants &amp; Rights</span>
                <span className="font-semibold text-blue-600 dark:text-blue-400 font-mono">Pillar 4</span>
              </div>
            </button>
          </div>
        </div>

        {/* Pillar Navigation Tabs */}
        <div className="flex border-b border-stone-200 dark:border-stone-800 bg-stone-100/70 dark:bg-stone-950/40 p-1.5 gap-1.5 overflow-x-auto">
          <button
            onClick={() => setActiveTab('housing')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'housing'
                ? 'bg-white dark:bg-stone-800 text-emerald-800 dark:text-emerald-300 shadow-sm border border-stone-200/80 dark:border-stone-700'
                : 'text-stone-600 dark:text-stone-400 hover:bg-white/50 dark:hover:bg-stone-800/50'
            }`}
          >
            <Home className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>1. Housing</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-mono font-bold">
              {PILLAR_RESOURCE_COUNTS.housing}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('treatment')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'treatment'
                ? 'bg-white dark:bg-stone-800 text-rose-800 dark:text-rose-300 shadow-sm border border-stone-200/80 dark:border-stone-700'
                : 'text-stone-600 dark:text-stone-400 hover:bg-white/50 dark:hover:bg-stone-800/50'
            }`}
          >
            <HeartHandshake className="w-4 h-4 text-rose-600 dark:text-rose-400" />
            <span>2. Health &amp; Detox</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-mono font-bold">
              {PILLAR_RESOURCE_COUNTS.health}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('work')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'work'
                ? 'bg-white dark:bg-stone-800 text-amber-800 dark:text-amber-300 shadow-sm border border-stone-200/80 dark:border-stone-700'
                : 'text-stone-600 dark:text-stone-400 hover:bg-white/50 dark:hover:bg-stone-800/50'
            }`}
          >
            <Briefcase className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>3. Employment</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-mono font-bold">
              {PILLAR_RESOURCE_COUNTS.employment}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('legal')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'legal'
                ? 'bg-white dark:bg-stone-800 text-blue-800 dark:text-blue-300 shadow-sm border border-stone-200/80 dark:border-stone-700'
                : 'text-stone-600 dark:text-stone-400 hover:bg-white/50 dark:hover:bg-stone-800/50'
            }`}
          >
            <Scale className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>4. Legal Help</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-mono font-bold">
              {PILLAR_RESOURCE_COUNTS.legal}
            </span>
          </button>
        </div>

        {/* Optional Help Banner */}
        {showHowToGiveDocs && (
          <div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-800 text-amber-950 dark:text-amber-200 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold">How Document Uploads Work:</p>
              <p className="text-[11px] leading-relaxed">
                All resource data from your uploaded PDFs is already fully digitized into this searchable directory so anyone on mobile or desktop can immediately search and call.
                To link the actual PDF files directly for 1-click download, place <strong>recoveryhomes.pdf</strong>, <strong>Comprehensive Recovery Directory V2.pdf</strong>, and <strong>Registered-Apprenticeship-Program-List.pdf</strong> into the <code>public/</code> folder using the AI Studio file explorer!
              </p>
            </div>
            <button
              onClick={() => setShowHowToGiveDocs(false)}
              className="ml-auto text-amber-600 hover:text-amber-900"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Master Consolidated Source Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-900 via-stone-900 to-amber-950 text-white border border-emerald-700/50 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600/90 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                <Sparkles className="w-5 h-5 text-amber-300" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                    Master Core Source
                  </span>
                  <span className="text-[11px] text-stone-300 font-mono">v3.0 Unified Master</span>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-white font-serif">
                  Tom &amp; B.A.M.B.I. Master Core Knowledge Pack
                </h3>
                <p className="text-xs text-stone-300 max-w-xl leading-relaxed">
                  Single consolidated source file containing the complete Tom Runtime Specification, 5 RSM Boundary Failures, 3 Gemini Gem prompts, NotebookLLM sync workflow, and all Arizona recovery directories.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <a
                href={NOTEBOOK_LLM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md active:scale-95"
                title="Open Tom & B.A.M.B.I. Master Knowledge Vault in Google NotebookLM"
              >
                <BookOpen className="w-4 h-4 text-amber-200" />
                <span>Open in NotebookLM</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <a
                href="/Tom-Core-Sourcefile-Master.md"
                download="Tom-Core-Sourcefile-Master.md"
                className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md active:scale-95"
                title="Download consolidated source markdown"
              >
                <Download className="w-4 h-4" />
                <span>Download Core (.md)</span>
              </a>
            </div>
          </div>

          {/* TAB 1: HOUSING */}
          {activeTab === 'housing' && (
            <div className="space-y-6">
              {/* PDF Documents Download Banner */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Doc 1: recoveryhomes.pdf */}
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex flex-col justify-between gap-3 shadow-xs">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                        Official Document 1
                      </span>
                      <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                        recoveryhomes.pdf
                      </h4>
                      <p className="text-xs text-stone-600 dark:text-stone-300 mt-0.5">
                        Halfway House programs, low-barrier homes, emergency shelters & crisis respites.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <a
                      href="/recoveryhomes.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Open / Download PDF</span>
                    </a>
                    <span className="text-[11px] text-stone-500 dark:text-stone-400 font-mono">
                      16 Pages
                    </span>
                  </div>
                </div>

                {/* Doc 2: Comprehensive Recovery Directory V2.pdf */}
                <div className="p-4 rounded-2xl bg-stone-100 dark:bg-stone-800/70 border border-stone-200 dark:border-stone-700 flex flex-col justify-between gap-3 shadow-xs">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-stone-900 dark:bg-stone-700 text-white flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                        Official Document 2
                      </span>
                      <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                        Comprehensive Recovery Directory V2.pdf
                      </h4>
                      <p className="text-xs text-stone-600 dark:text-stone-300 mt-0.5">
                        Consolidated Arizona recovery facilities, halfway houses & behavioral services.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <a
                      href="/Comprehensive_Recovery_Directory_V2.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white text-xs font-bold transition-all shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Open / Download PDF</span>
                    </a>
                    <span className="text-[11px] text-stone-500 dark:text-stone-400 font-mono">
                      Consolidated Edition
                    </span>
                  </div>
                </div>
              </div>

              {/* Search & Filter Bar */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      type="text"
                      placeholder="Search recovery homes by name, city, address, or keyword..."
                      value={housingSearch}
                      onChange={(e) => setHousingSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-stone-100 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 placeholder-stone-400 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  {(['All', 'No Income', 'Halfway House', 'Emergency Shelter', 'Residential / BHRF', 'Crisis Respite'] as const).map(
                    (cat) => (
                      <button
                        key={cat}
                        onClick={() => setHousingFilter(cat)}
                        className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                          housingFilter === cat
                            ? 'bg-emerald-700 text-white shadow-xs'
                            : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'
                        }`}
                      >
                        {cat === 'No Income' ? '✨ No Income Required' : cat}
                      </button>
                    )
                  )}
                  <span className="text-[11px] text-stone-400 ml-auto font-mono">
                    Showing {filteredHousing.length} locations
                  </span>
                </div>
              </div>

              {/* Housing List Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredHousing.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-white dark:bg-stone-800/90 border border-stone-200 dark:border-stone-700/80 shadow-xs flex flex-col justify-between hover:border-emerald-500/60 transition-all space-y-3"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-300">
                          {item.category}
                        </span>
                        {item.noIncomeRequired && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                            No Income Req.
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100 leading-snug">
                        {item.name}
                      </h4>
                      <div className="flex items-start gap-1.5 text-xs text-stone-500 dark:text-stone-400 mt-1">
                        <MapPin className="w-3.5 h-3.5 shrink-0 text-amber-600 mt-0.5" />
                        <span className="leading-tight">{item.location}</span>
                      </div>
                      {item.contactNotes && (
                        <p className="text-[11px] text-stone-600 dark:text-stone-300 mt-2 bg-stone-50 dark:bg-stone-900/60 p-2 rounded-xl border border-stone-100 dark:border-stone-800 leading-relaxed">
                          {item.contactNotes}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-stone-100 dark:border-stone-700/50">
                      {item.phone && (
                        <a
                          href={`tel:${item.phone.replace(/[^0-9]/g, '')}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-xs"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>{item.phone}</span>
                        </a>
                      )}
                      {item.website && (
                        <a
                          href={item.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-700 hover:bg-stone-200 text-stone-700 dark:text-stone-300 text-xs font-medium transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Website</span>
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: WORK RESOURCES (APPRENTICESHIPS) */}
          {activeTab === 'work' && (
            <div className="space-y-6">
              {/* Document Download Banner */}
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                      Arizona Department of Economic Security
                    </span>
                    <h4 className="text-base font-bold text-stone-900 dark:text-stone-100">
                      Registered-Apprenticeship-Program-List.pdf
                    </h4>
                    <p className="text-xs text-stone-600 dark:text-stone-300 mt-0.5">
                      44-page official directory of Arizona paid registered apprenticeships: Carpenters, Electricians, Plumbers, Mechanics, HVAC & more.
                    </p>
                  </div>
                </div>

                <a
                  href="/Registered-Apprenticeship-Program-List.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shrink-0 shadow-md active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Full 44-Page PDF</span>
                </a>
              </div>

              {/* Search & Filter */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      type="text"
                      placeholder="Search trade (Carpenter, Electrician, HVAC, Plumber, Welder, Machinist)..."
                      value={workSearch}
                      onChange={(e) => setWorkSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-stone-100 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 placeholder-stone-400 text-xs focus:outline-none focus:ring-2 focus:ring-amber-600"
                    />
                  </div>

                  <button
                    onClick={() => setWorkOnlyAccepting(!workOnlyAccepting)}
                    className={`px-3 py-2 rounded-2xl text-xs font-bold border transition-colors flex items-center gap-2 ${
                      workOnlyAccepting
                        ? 'bg-emerald-700 text-white border-emerald-600'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Accepting Applications Only</span>
                  </button>
                </div>

                {/* Trade Sector Filter Row */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {(['All', 'Electrical', 'Plumbing & Pipe', 'Carpentry & Millwright', 'Steel & Iron', 'Heavy Equipment'] as const).map(
                    (trade) => (
                      <button
                        key={trade}
                        onClick={() => setWorkTradeFilter(trade)}
                        className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                          workTradeFilter === trade
                            ? 'bg-amber-600 text-white shadow-xs'
                            : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'
                        }`}
                      >
                        {trade}
                      </button>
                    )
                  )}
                </div>

                <div className="flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400 px-1 pt-0.5">
                  <span>Earn while you learn: Paid on-the-job training with full benefits and career credentials.</span>
                  <span className="font-mono font-bold">Showing {filteredWork.length} programs</span>
                </div>
              </div>

              {/* Apprenticeship Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredWork.map((app) => (
                  <div
                    key={app.id}
                    className="p-4 rounded-2xl bg-white dark:bg-stone-800/90 border border-stone-200 dark:border-stone-700/80 shadow-xs flex flex-col justify-between hover:border-amber-500/60 transition-all space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="text-xs font-extrabold text-amber-700 dark:text-amber-400">
                          {app.occupation}
                        </span>
                        {app.acceptingApplications ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                            ✓ Accepting Now
                          </span>
                        ) : (
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-700 text-stone-500">
                            Check Sponsor
                          </span>
                        )}
                      </div>

                      <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                        {app.sponsorName}
                      </h4>

                      <div className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400 mt-1">
                        <MapPin className="w-3.5 h-3.5 shrink-0 text-stone-400" />
                        <span>{app.sponsorCity}, {app.sponsorCounty}</span>
                      </div>

                      <div className="mt-2.5 p-2 rounded-xl bg-stone-50 dark:bg-stone-900/60 border border-stone-100 dark:border-stone-800">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400">How To Apply</p>
                        <p className="text-xs text-stone-700 dark:text-stone-300 mt-0.5 font-medium leading-relaxed">
                          {app.howToApply}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-stone-100 dark:border-stone-700/50">
                      {app.phone && (
                        <a
                          href={`tel:${app.phone.replace(/[^0-9]/g, '')}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-700 hover:bg-stone-200 text-stone-800 dark:text-stone-200 text-xs font-bold transition-colors"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>{app.phone}</span>
                        </a>
                      )}
                      {app.linkOrEmail && (
                        <a
                          href={app.linkOrEmail}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors shadow-xs ml-auto"
                        >
                          <span>Apply / Details</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: HEALTH & TREATMENT */}
          {activeTab === 'treatment' && (
            <div className="space-y-6">
              <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-rose-50 to-stone-50 dark:from-stone-900 dark:to-stone-950 border border-rose-200 dark:border-rose-900/60 space-y-5">
                <div className="max-w-xl space-y-2.5">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 text-xs font-bold">
                    <HeartHandshake className="w-3.5 h-3.5" />
                    <span>Pillar 2 • Health, Detox &amp; 24/7 Crisis Access</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100 font-serif">
                    Compassionate Treatment Navigation &amp; 24/7 Detox Access
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                    Navigating intake, medically supervised detox, AHCCCS-funded 25-day beds, and crisis stabilization can be overwhelming. Connect directly with verified treatment providers and direct peer navigation.
                  </p>
                </div>

                {/* 3 Treatment Links: Granite Mountain Behavioral, 6027672147 Bambi, Axiom Care */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Link 1: Granite Mountain Behavioral */}
                  <div className="p-4 rounded-2xl bg-white dark:bg-stone-800 border border-rose-200 dark:border-rose-900/60 shadow-xs flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">Residential &amp; Detox</span>
                        <ExternalLink className="w-3.5 h-3.5 text-rose-500" />
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100">
                        Granite Mountain Behavioral
                      </h4>
                      <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-relaxed mt-1">
                        Accredited inpatient residential recovery, medically supervised detox, and dual-diagnosis behavioral healthcare.
                      </p>
                    </div>
                    <div className="pt-2 flex flex-col gap-1.5">
                      <a
                        href="https://granitemountainbhc.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 w-full px-3 py-1.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold shadow-xs transition-all"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Visit Website</span>
                      </a>
                      <a
                        href="tel:9287560695"
                        className="inline-flex items-center justify-center gap-1.5 w-full px-3 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 dark:bg-stone-700 dark:hover:bg-stone-600 text-stone-700 dark:text-stone-200 text-[10.5px] font-semibold transition-all"
                      >
                        <Phone className="w-3 h-3 text-rose-600" />
                        <span>Call (928) 756-0695</span>
                      </a>
                    </div>
                  </div>

                  {/* Link 2: 6027672147 Bambi */}
                  <div className="p-4 rounded-2xl bg-white dark:bg-stone-800 border-2 border-rose-500 dark:border-rose-600 shadow-sm flex flex-col justify-between space-y-3 relative">
                    <span className="absolute -top-2.5 left-4 px-2 py-0.5 rounded-full bg-rose-600 text-[9px] font-bold text-white uppercase tracking-wider shadow-2xs">
                      Direct Peer Line
                    </span>
                    <div>
                      <div className="flex items-center justify-between mb-1.5 mt-0.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">Immediate Navigation</span>
                        <Phone className="w-3.5 h-3.5 text-rose-600" />
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100">
                        6027672147 Bambi
                      </h4>
                      <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-relaxed mt-1">
                        Speak directly with a peer who knows every intake door and detox bed in the Valley.
                      </p>
                    </div>
                    <div className="pt-2 flex flex-col gap-1.5">
                      <a
                        href="tel:6027672147"
                        className="inline-flex items-center justify-center gap-1.5 w-full px-3 py-1.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold shadow-xs transition-all"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Call 602-767-2147</span>
                      </a>
                      <a
                        href="sms:6027672147"
                        className="inline-flex items-center justify-center gap-1.5 w-full px-3 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 dark:bg-stone-700 dark:hover:bg-stone-600 text-stone-700 dark:text-stone-200 text-[10.5px] font-semibold transition-all"
                      >
                        <span>Text Bambi Direct</span>
                      </a>
                    </div>
                  </div>

                  {/* Link 3: Axiom Care */}
                  <div className="p-4 rounded-2xl bg-white dark:bg-stone-800 border border-rose-200 dark:border-rose-900/60 shadow-xs flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">Medical Detox &amp; Inpatient</span>
                        <ExternalLink className="w-3.5 h-3.5 text-rose-500" />
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100">
                        Axiom Care
                      </h4>
                      <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-relaxed mt-1">
                        24/7 medically managed detox, acute stabilization &amp; AHCCCS-contracted substance treatment beds.
                      </p>
                    </div>
                    <div className="pt-2 flex flex-col gap-1.5">
                      <a
                        href="https://axiomcareaz.org"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 w-full px-3 py-1.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold shadow-xs transition-all"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Visit Website</span>
                      </a>
                      <a
                        href="tel:8449294662"
                        className="inline-flex items-center justify-center gap-1.5 w-full px-3 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 dark:bg-stone-700 dark:hover:bg-stone-600 text-stone-700 dark:text-stone-200 text-[10.5px] font-semibold transition-all"
                      >
                        <Phone className="w-3 h-3 text-rose-600" />
                        <span>Call (844) 929-4662</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* 24/7 AI Peer Mentor Tom Banner */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-white/70 dark:bg-stone-900/70 border border-stone-200 dark:border-stone-800 text-xs">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                    <span className="text-stone-700 dark:text-stone-300">
                      Need to talk through an urge, anxiety, or understand what intake looks like right now?
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      onClose();
                      onOpenTomAI?.();
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white dark:bg-stone-100 dark:text-stone-900 font-bold transition-all shrink-0"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Open Tom AI Chat</span>
                  </button>
                </div>
              </div>

              {/* Health Search & Directory */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      type="text"
                      placeholder="Search health resources (detox, 24/7 walk-in, respite, inpatient, Peoria, CBI, 988)..."
                      value={healthSearch}
                      onChange={(e) => setHealthSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-stone-100 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 placeholder-stone-400 text-xs focus:outline-none focus:ring-2 focus:ring-rose-600"
                    />
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-2 text-xs text-stone-500 dark:text-stone-400">
                    <span className="font-mono font-bold">Showing {filteredHealth.length} of {HEALTH_RESOURCES.length} facilities</span>
                  </div>
                </div>

                {/* Health Category Filter Row */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {(['All', 'Crisis & Detox', 'Inpatient Stabilization', 'Crisis Respite', 'Integrated Care', 'Direct Peer Support'] as const).map(
                    (cat) => (
                      <button
                        key={cat}
                        onClick={() => setHealthFilter(cat)}
                        className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                          healthFilter === cat
                            ? 'bg-rose-700 text-white shadow-xs'
                            : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'
                        }`}
                      >
                        {cat}
                      </button>
                    )
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filteredHealth.map((facility) => (
                    <div
                      key={facility.id}
                      className="p-4 rounded-2xl bg-white dark:bg-stone-800/90 border border-stone-200 dark:border-stone-700 shadow-xs flex flex-col justify-between hover:border-rose-400/60 transition-all space-y-3"
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300">
                            {facility.category}
                          </span>
                          <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                            {facility.funding}
                          </span>
                        </div>

                        <div>
                          <h5 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                            {facility.name}
                          </h5>
                          <div className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400 mt-1">
                            <MapPin className="w-3.5 h-3.5 shrink-0 text-stone-400" />
                            <span>{facility.location}</span>
                          </div>
                        </div>

                        <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                          {facility.description}
                        </p>

                        {facility.urgentService && (
                          <div className="p-2 rounded-xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200/60 dark:border-rose-900/40 text-[11px] font-medium text-rose-900 dark:text-rose-200 flex items-center gap-1.5">
                            <Activity className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                            <span>{facility.urgentService}</span>
                          </div>
                        )}
                      </div>

                      <div className="pt-2 border-t border-stone-100 dark:border-stone-700/50 flex items-center justify-between gap-2">
                        <a
                          href={`tel:${facility.phone.replace(/[^0-9]/g, '')}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-700 hover:bg-stone-200 text-stone-800 dark:text-stone-200 text-xs font-bold transition-colors"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>{facility.phone}</span>
                        </a>

                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-stone-500 font-medium">
                            {facility.hours}
                          </span>
                          {facility.website && (
                            <a
                              href={facility.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
                              title="Visit facility website"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: LEGAL HELP */}
          {activeTab === 'legal' && (
            <div className="space-y-6">
              <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-blue-50 to-stone-50 dark:from-stone-900 dark:to-stone-950 border border-blue-200 dark:border-blue-900/60 space-y-5">
                <div className="max-w-xl space-y-2.5">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 text-xs font-bold">
                    <Scale className="w-3.5 h-3.5" />
                    <span>Pillar 4 • Legal &amp; Re-Entry Advocacy</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100 font-serif">
                    Get Your Legal Issues Right. Move Forward.
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                    Old warrants, court fines, suspended licenses, and missing identification keep good people trapped. B.A.M.B.I. helps you tackle obstacles step-by-step so you can obtain employment and stay free.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shadow-xs space-y-1">
                    <span className="text-[10px] font-bold text-blue-600 uppercase">Step 1</span>
                    <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100">Warrants &amp; Court Dates</h4>
                    <p className="text-[11px] text-stone-500 leading-relaxed">
                      Walk-in warrant resolution clinics in Phoenix &amp; Maricopa without jail custody.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shadow-xs space-y-1">
                    <span className="text-[10px] font-bold text-blue-600 uppercase">Step 2</span>
                    <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100">MVD Fee Waivers &amp; IDs</h4>
                    <p className="text-[11px] text-stone-500 leading-relaxed">
                      A.R.S. § 28-3165 homeless fee waiver vouchers for state IDs and birth certificates.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shadow-xs space-y-1">
                    <span className="text-[10px] font-bold text-blue-600 uppercase">Step 3</span>
                    <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100">Fines &amp; Expungement</h4>
                    <p className="text-[11px] text-stone-500 leading-relaxed">
                      FARE program fine relief, license reinstatement, and Clean Slate set-asides.
                    </p>
                  </div>
                </div>
              </div>

              {/* Legal Search & Directory */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      type="text"
                      placeholder="Search legal programs (warrants, MVD ID, fine relief, expungement, legal aid)..."
                      value={legalSearch}
                      onChange={(e) => setLegalSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-stone-100 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 placeholder-stone-400 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-2 text-xs text-stone-500 dark:text-stone-400">
                    <span className="font-mono font-bold">Showing {filteredLegal.length} of {LEGAL_RESOURCES.length} legal programs</span>
                  </div>
                </div>

                {/* Legal Category Filter Row */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {(['All', 'Warrant Resolution', 'ID & Vital Records', 'Fines & Driver License', 'Re-Entry & Expungement', 'Legal Aid'] as const).map(
                    (cat) => (
                      <button
                        key={cat}
                        onClick={() => setLegalFilter(cat)}
                        className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                          legalFilter === cat
                            ? 'bg-blue-700 text-white shadow-xs'
                            : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'
                        }`}
                      >
                        {cat}
                      </button>
                    )
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filteredLegal.map((program) => (
                    <div
                      key={program.id}
                      className="p-4 rounded-2xl bg-white dark:bg-stone-800/90 border border-stone-200 dark:border-stone-700 shadow-xs flex flex-col justify-between hover:border-blue-400/60 transition-all space-y-3"
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300">
                            {program.category}
                          </span>
                          <span className="text-[11px] font-bold text-stone-500 dark:text-stone-400">
                            {program.city}
                          </span>
                        </div>

                        <div>
                          <h5 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                            {program.name}
                          </h5>
                          <div className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400 mt-1">
                            <MapPin className="w-3.5 h-3.5 shrink-0 text-stone-400" />
                            <span>{program.location}</span>
                          </div>
                        </div>

                        <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                          {program.serviceSummary}
                        </p>

                        <div className="p-2 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/40 text-[11px] text-blue-900 dark:text-blue-200 space-y-0.5">
                          <span className="font-bold uppercase tracking-wider text-[10px] text-blue-700 dark:text-blue-300">How to Access:</span>
                          <p className="leading-relaxed">{program.stepsToAccess}</p>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-stone-100 dark:border-stone-700/50 flex items-center justify-between gap-2">
                        <a
                          href={`tel:${program.phone.replace(/[^0-9]/g, '')}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-700 hover:bg-stone-200 text-stone-800 dark:text-stone-200 text-xs font-bold transition-colors"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>{program.phone}</span>
                        </a>

                        {program.website && (
                          <a
                            href={program.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors shadow-xs ml-auto"
                          >
                            <span>Official Portal</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Direct Bambi Legal Navigation Contact Banner */}
              <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-blue-950 dark:text-blue-200 flex items-center gap-1.5">
                    <Scale className="w-3.5 h-3.5 text-blue-600" />
                    <span>Valley Re-Entry Advocacy &amp; Second-Chance Apprenticeships</span>
                  </h4>
                  <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                    Connect directly with Bambi for 1-on-1 navigation with Maricopa County Public Defender clinics and second-chance trade sponsors.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href="tel:6027672147"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold shadow-xs transition-all"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call (602) 767-2147</span>
                  </a>
                  <a
                    href="mailto:bambiboy602@gmail.com?subject=Legal%20Advocacy%20Help%20Request"
                    className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 text-stone-800 dark:text-stone-200 text-xs font-semibold transition-colors"
                  >
                    <span>Email Bambi</span>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>B.A.M.B.I. Peer Support • Phoenix, AZ • Phone: 602-767-2147</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-semibold text-xs transition-colors"
          >
            Close Directory
          </button>
        </div>
      </div>
    </div>
  );
};
