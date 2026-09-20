import React from 'react';
import { CreatorProfile, ProductItem } from '../types';
import {
  Heart,
  Home,
  Briefcase,
  HeartHandshake,
  Scale,
  FileText,
  ChevronRight,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { TomBotCard } from './TomBotCard';
import { OFFICIAL_TOM_GEM_URL } from '../data/googleGemsData';

interface ProfileHeaderProps {
  profile: CreatorProfile;
  products: ProductItem[];
  sharedChatUrl: string;
  externalPrompt?: string;
  onClearExternalPrompt?: () => void;
  onScrollToChat: () => void;
  onScrollToProducts: () => void;
  onScrollToVideos: () => void;
  onScrollToContact: () => void;
  onOpenPillar?: (pillar: 'housing' | 'work' | 'treatment' | 'legal') => void;
  onOpenGoogleGems?: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profile,
  products,
  sharedChatUrl,
  externalPrompt,
  onClearExternalPrompt,
  onScrollToChat,
  onScrollToProducts,
  onScrollToVideos,
  onScrollToContact,
  onOpenPillar,
  onOpenGoogleGems,
}) => {
  const getPillarIcon = (iconName: string) => {
    switch (iconName) {
      case 'Home':
        return <Home className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case 'Briefcase':
        return <Briefcase className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
      case 'HeartHandshake':
        return <HeartHandshake className="w-4 h-4 text-rose-600 dark:text-rose-400" />;
      case 'Scale':
        return <Scale className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
      default:
        return <Heart className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
    }
  };

  return (
    <section id="creator-profile" className="pt-4 sm:pt-6 pb-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Centered About Me Information */}
      <div className="text-center max-w-4xl mx-auto mb-8 px-4 space-y-3">
        <p className="text-base sm:text-xl font-bold tracking-wide text-emerald-800 dark:text-emerald-300 font-serif">
          "{profile.tagline}"
        </p>
        <p className="text-stone-700 dark:text-stone-300 text-sm sm:text-base leading-relaxed max-w-3xl mx-auto">
          {profile.bio}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* Left Column: B.A.M.B.I. Widescreen Logo + Tom AI Bot + Bambi Signature */}
        <div className="lg:col-span-5 flex flex-col items-center">
          {/* B.A.M.B.I. Official Widescreen Logo inserted above Chat Bot - Stretched just a little wider than the bot */}
          <div className="mb-4 w-full flex justify-center">
            <div className="w-full max-w-[485px] sm:max-w-[495px]">
              <img
                src="/assets/bambi-logo-widescreen.svg"
                alt="B.A.M.B.I. Peer Support Services Official Logo"
                className="w-full h-auto object-contain hover:scale-[1.01] transition-transform drop-shadow-xs"
              />
            </div>
          </div>

          {/* Tom AI Bot */}
          <TomBotCard
            profile={profile}
            products={products}
            sharedChatUrl={sharedChatUrl}
            externalPrompt={externalPrompt}
            onClearExternalPrompt={onClearExternalPrompt}
          />

          {/* Bambi Signature Pic brought below Chat Bot - Widened 300%, low height, no frame */}
          <div className="w-full mt-4 flex items-center justify-center">
            <img
              src="/bambisignature.png"
              alt="Bambi - B.A.M.B.I. Signature"
              className="w-full max-w-md sm:max-w-lg h-24 sm:h-28 object-fill"
            />
          </div>
        </div>

        {/* Right Column: 4 Pillars of Direct Support & Community Resources */}
        <div className="lg:col-span-7 flex flex-col justify-center text-left space-y-4">

          {/* 4 Pillars of Direct Support (Interactive Buttons & Document Links) */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2.5">
              <p className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                <span>4 Pillars of Direct Support</span>
                <span className="text-[11px] font-normal text-stone-500 lowercase">(click to view resources &amp; documents)</span>
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Pillar 1: Housing */}
              <div
                id="pillar-btn-housing"
                onClick={() => onOpenPillar?.('housing')}
                className="group relative flex flex-col justify-between p-3.5 rounded-2xl bg-white dark:bg-stone-800/90 border border-stone-200 hover:border-emerald-500 dark:border-stone-700 dark:hover:border-emerald-500 shadow-sm hover:shadow-md transition-all cursor-pointer text-left"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                        <Home className="w-4 h-4" />
                      </div>
                      <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                        Housing
                      </h4>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      2 PDF Docs
                    </span>
                  </div>
                  <p className="text-[11.5px] text-stone-600 dark:text-stone-300 leading-snug">
                    Safe halfway houses, low-barrier recovery beds, crisis respite &amp; emergency shelters.
                  </p>
                </div>

                {/* Direct Document Links */}
                <div className="mt-3 pt-2.5 border-t border-stone-100 dark:border-stone-700/60 flex flex-wrap gap-1.5" onClick={(e) => e.stopPropagation()}>
                  <a
                    href="/recoveryhomes.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/80 hover:bg-emerald-100 dark:hover:bg-emerald-900 text-emerald-800 dark:text-emerald-200 text-[10.5px] font-bold border border-emerald-200 dark:border-emerald-800 transition-colors shadow-2xs"
                    title="Open recoveryhomes.pdf"
                  >
                    <FileText className="w-3 h-3 text-emerald-600" />
                    <span>recoveryhomes.pdf</span>
                  </a>
                  <a
                    href="/Comprehensive_Recovery_Directory_V2.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-700/80 hover:bg-stone-200 dark:hover:bg-stone-600 text-stone-800 dark:text-stone-200 text-[10.5px] font-bold border border-stone-200 dark:border-stone-600 transition-colors shadow-2xs"
                    title="Open Comprehensive_Recovery_Directory_V2.pdf"
                  >
                    <FileText className="w-3 h-3 text-stone-600 dark:text-stone-300" />
                    <span>Recovery Directory V2.pdf</span>
                  </a>
                </div>
              </div>

              {/* Pillar 2: Work Resources */}
              <div
                id="pillar-btn-work"
                onClick={() => onOpenPillar?.('work')}
                className="group relative flex flex-col justify-between p-3.5 rounded-2xl bg-white dark:bg-stone-800/90 border border-stone-200 hover:border-amber-500 dark:border-stone-700 dark:hover:border-amber-500 shadow-sm hover:shadow-md transition-all cursor-pointer text-left"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                        <Briefcase className="w-4 h-4" />
                      </div>
                      <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
                        Work Resources
                      </h4>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                      44-Page PDF
                    </span>
                  </div>
                  <p className="text-[11.5px] text-stone-600 dark:text-stone-300 leading-snug">
                    Paid registered apprenticeships: Carpenters, Electricians, Plumbers, HVAC &amp; jobs.
                  </p>
                </div>

                {/* Direct Document Link */}
                <div className="mt-3 pt-2.5 border-t border-stone-100 dark:border-stone-700/60 flex flex-wrap gap-1.5" onClick={(e) => e.stopPropagation()}>
                  <a
                    href="/Registered-Apprenticeship-Program-List.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/80 hover:bg-amber-100 dark:hover:bg-amber-900 text-amber-800 dark:text-amber-200 text-[10.5px] font-bold border border-amber-200 dark:border-amber-800 transition-colors shadow-2xs"
                    title="Open Registered-Apprenticeship-Program-List.pdf"
                  >
                    <FileText className="w-3 h-3 text-amber-600" />
                    <span>Apprenticeship-Program-List.pdf</span>
                  </a>
                </div>
              </div>

              {/* Pillar 3: Treatment */}
              <div
                id="pillar-btn-treatment"
                onClick={() => onOpenPillar?.('treatment')}
                className="group relative flex flex-col justify-between p-3.5 rounded-2xl bg-white dark:bg-stone-800/90 border border-stone-200 hover:border-rose-500 dark:border-stone-700 dark:hover:border-rose-500 shadow-sm hover:shadow-md transition-all cursor-pointer text-left"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 group-hover:bg-rose-600 group-hover:text-white transition-colors">
                        <HeartHandshake className="w-4 h-4" />
                      </div>
                      <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100 group-hover:text-rose-700 dark:group-hover:text-rose-400 transition-colors">
                        Treatment
                      </h4>
                    </div>
                    <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-rose-500 group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <p className="text-[11.5px] text-stone-600 dark:text-stone-300 leading-snug">
                    Medically supervised detox, AHCCCS 25-day beds, and intensive residential recovery.
                  </p>
                </div>
                <div className="mt-3 pt-2.5 border-t border-stone-100 dark:border-stone-700/60 flex items-center justify-between text-[11px] text-stone-500">
                  <span className="font-semibold text-rose-600 dark:text-rose-400">Direct Intake Line</span>
                  <span>602-767-2147</span>
                </div>
              </div>

              {/* Pillar 4: Legal Help */}
              <div
                id="pillar-btn-legal"
                onClick={() => onOpenPillar?.('legal')}
                className="group relative flex flex-col justify-between p-3.5 rounded-2xl bg-white dark:bg-stone-800/90 border border-stone-200 hover:border-blue-500 dark:border-stone-700 dark:hover:border-blue-500 shadow-sm hover:shadow-md transition-all cursor-pointer text-left"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <Scale className="w-4 h-4" />
                      </div>
                      <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
                        Legal Help
                      </h4>
                    </div>
                    <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <p className="text-[11.5px] text-stone-600 dark:text-stone-300 leading-snug">
                    Warrant quash clinics, driver's license reinstatement, state ID fee waivers &amp; court fines.
                  </p>
                </div>
                <div className="mt-3 pt-2.5 border-t border-stone-100 dark:border-stone-700/60 flex items-center justify-between text-[11px] text-stone-500">
                  <span className="font-semibold text-blue-600 dark:text-blue-400">Re-Entry Advocacy</span>
                  <span>Phoenix Court Help</span>
                </div>
              </div>
            </div>

            {/* Google Gemini Gems AI Architecture Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/20 via-stone-900/40 to-amber-950/20 dark:from-emerald-950/50 dark:to-amber-950/40 border border-emerald-600/30 dark:border-emerald-500/30 shadow-md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-2.5">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-xl bg-amber-400 text-stone-950 shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                      <span>Official Google Gemini Gems</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 font-extrabold">
                        3-Gem System
                      </span>
                    </h4>
                    <p className="text-[10.5px] text-stone-500 dark:text-stone-400">
                      Grounded in Tom-Core-Sourcefile-Master.md
                    </p>
                  </div>
                </div>

                <a
                  href={OFFICIAL_TOM_GEM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold shadow-xs transition-all active:scale-95 shrink-0"
                >
                  <span>Chat in Google Gem</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-2 pt-2.5 border-t border-stone-200/60 dark:border-stone-800">
                <div className="p-2 rounded-xl bg-white/70 dark:bg-stone-800/70 border border-stone-200/60 dark:border-stone-700/60">
                  <div className="text-[9.5px] font-bold text-emerald-700 dark:text-emerald-400">Gem #1</div>
                  <div className="text-[11px] font-bold text-stone-900 dark:text-stone-100">Tom Core</div>
                  <div className="text-[9.5px] text-stone-500 truncate">Curb Mentor</div>
                </div>
                <div className="p-2 rounded-xl bg-white/70 dark:bg-stone-800/70 border border-stone-200/60 dark:border-stone-700/60">
                  <div className="text-[9.5px] font-bold text-amber-600 dark:text-amber-400">Gem #2</div>
                  <div className="text-[11px] font-bold text-stone-900 dark:text-stone-100">Diagnostic</div>
                  <div className="text-[9.5px] text-stone-500 truncate">5-Stage Loop</div>
                </div>
                <div className="p-2 rounded-xl bg-white/70 dark:bg-stone-800/70 border border-stone-200/60 dark:border-stone-700/60">
                  <div className="text-[9.5px] font-bold text-purple-600 dark:text-purple-400">Gem #3</div>
                  <div className="text-[11px] font-bold text-stone-900 dark:text-stone-100">The Grower</div>
                  <div className="text-[9.5px] text-stone-500 truncate">Insight Learning</div>
                </div>
              </div>

              {onOpenGoogleGems && (
                <button
                  onClick={onOpenGoogleGems}
                  className="w-full mt-2.5 py-1.5 rounded-xl bg-stone-200/80 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-[11px] font-bold transition-colors flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>View All 3 Google Gem Prompts &amp; Setup</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

