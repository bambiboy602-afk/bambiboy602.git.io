import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  Bot,
  User,
  ExternalLink,
  Radio,
  Search,
  Globe,
  RotateCcw,
  Link2,
  Sliders,
  Camera,
  Play,
  Check,
  MessageSquare,
  BookOpen,
  Terminal,
  Cpu,
  Shield,
  Layers,
  ChevronDown,
  ChevronUp,
  X,
} from 'lucide-react';
import { AnimatedAvatar, AvatarStyle } from './AnimatedAvatar';
import { ChatMessage, AvatarEmotion, ProductItem, CreatorProfile } from '../types';
import { useSpeech } from '../hooks/useSpeech';
import { generateClientTomReply } from '../services/tomBrainEngine';
import { GoogleGemsModal } from './GoogleGemsModal';
import {
  OFFICIAL_TOM_GEM_URL,
  BAMBI_GEM_URL,
  GROWER_GEM_URL,
  MASTER_VAULT_GEM_URL,
  NOTEBOOK_LLM_URL,
  GemModeId,
} from '../data/googleGemsData';
import { TOM_OPENING_STATEMENT } from '../data/tomOpeningStatements';

interface TomBotCardProps {
  profile: CreatorProfile;
  products: ProductItem[];
  sharedChatUrl: string;
  externalPrompt?: string;
  onClearExternalPrompt?: () => void;
  isSudoMode?: boolean;
  onToggleSudoMode?: () => void;
  onSetSudoMode?: (active: boolean) => void;
}

export const TomBotCard: React.FC<TomBotCardProps> = ({
  profile,
  products,
  sharedChatUrl,
  externalPrompt,
  onClearExternalPrompt,
  isSudoMode: isSudoModeProp,
  onToggleSudoMode,
  onSetSudoMode,
}) => {
  const [localSudoMode, setLocalSudoMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('bambi_sudo_mode') === 'true';
    }
    return false;
  });

  const isSudoActive = isSudoModeProp !== undefined ? isSudoModeProp : localSudoMode;

  const handleToggleSudo = () => {
    if (onToggleSudoMode) {
      onToggleSudoMode();
    } else {
      setLocalSudoMode((prev) => {
        const next = !prev;
        if (typeof window !== 'undefined') {
          localStorage.setItem('bambi_sudo_mode', String(next));
        }
        return next;
      });
    }
  };

  const handleEnableSudo = () => {
    if (onSetSudoMode) {
      onSetSudoMode(true);
    } else {
      setLocalSudoMode(true);
      if (typeof window !== 'undefined') {
        localStorage.setItem('bambi_sudo_mode', 'true');
      }
    }
  };

  const [inputMessage, setInputMessage] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [avatarEmotion, setAvatarEmotion] = useState<AvatarEmotion>('greeting');
  const [showSharedLink, setShowSharedLink] = useState(false);
  const [activeGemMode, setActiveGemMode] = useState<GemModeId>('tom-core');
  const [showGemsModal, setShowGemsModal] = useState(false);

  // Voice speech hook with customizer parameters
  const {
    isSpeaking,
    mouthOpenAmount,
    isMuted,
    toggleMute,
    isListening,
    speak,
    stopSpeaking,
    startVoiceInput,
    stopVoiceInput,
    voices,
    selectedVoiceIndex,
    setSelectedVoiceIndex,
    pitch,
    rate,
    setPitch,
    setRate,
    recognitionError,
    continuousMode,
    setContinuousMode,
  } = useSpeech();

  const [avatarStyle, setAvatarStyleState] = useState<AvatarStyle>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('tom_avatar_style') as AvatarStyle;
      if (saved && ['webbee', 'webbee-photo', 'me55-photo', 'street-mentor', 'clean-cap', 'photo', 'orb'].includes(saved)) {
        return saved;
      }
    }
    return 'webbee';
  });

  const [customPhotoUrl, setCustomPhotoUrlState] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('tom_avatar_photo') || '/webbee1.jpg';
    }
    return '/webbee1.jpg';
  });

  const [showCustomizer, setShowCustomizer] = useState(false);

  const setAvatarStyle = (style: AvatarStyle) => {
    setAvatarStyleState(style);
    if (typeof window !== 'undefined') localStorage.setItem('tom_avatar_style', style);
  };

  const setCustomPhotoUrl = (url: string) => {
    setCustomPhotoUrlState(url);
    if (typeof window !== 'undefined') localStorage.setItem('tom_avatar_photo', url);
  };

  const applyVoicePreset = (p: number, r: number, presetName: string) => {
    setPitch(p);
    setRate(r);
    speak(TOM_OPENING_STATEMENT.soundPresetPhrase(presetName));
  };

  const handleTestVoice = () => {
    speak(TOM_OPENING_STATEMENT.voiceTestPhrase);
  };

  // Chat message history initialized with Tom's curb persona from TOM_OPENING_STATEMENT
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-tom',
      sender: 'bot',
      text: TOM_OPENING_STATEMENT.chatWelcome,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      emotion: 'greeting',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll inside the chat stream
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  // Handle external prompt when user clicks "Ask Tom" from another section
  useEffect(() => {
    if (externalPrompt) {
      handleSendMessage(externalPrompt);
      if (onClearExternalPrompt) onClearExternalPrompt();
    }
  }, [externalPrompt]);

  const handleAvatarClick = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      setAvatarEmotion('happy');
      speak(
        TOM_OPENING_STATEMENT.avatarTapGreeting,
        () => setAvatarEmotion('idle')
      );
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || isThinking) return;

    // Intercept "sudo tom" to unlock Sudo Developer Mode
    if (query.toLowerCase().includes('sudo tom')) {
      handleEnableSudo();
    }

    // Loop Guard: Prevent sending the exact message Tom just said
    const lastBotMsg = [...messages].reverse().find((m) => m.sender === 'bot');
    if (lastBotMsg && lastBotMsg.text.trim().toLowerCase() === query.toLowerCase()) {
      console.log('Suppressed echo loop message matching last bot response');
      setInputMessage('');
      return;
    }

    setInputMessage('');
    stopSpeaking();

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isVoiceInput: isListening,
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsThinking(true);
    setAvatarEmotion('thoughtful');

    try {
      let botReply = '';
      let detectedEmotion: AvatarEmotion = 'explaining';
      let searchQueries: string[] | undefined;
      let searchSources: Array<{ title: string; uri: string }> | undefined;

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: query,
            history: messages,
            profileContext: profile,
            products: products,
            gemMode: activeGemMode,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.reply) {
            botReply = data.reply;
            detectedEmotion = data.avatarEmotion || 'explaining';
            searchQueries = data.searchQueries;
            searchSources = data.searchSources;
          }
        }
      } catch (networkErr) {
        console.log('GitHub Pages / offline mode: using standalone Tom brain engine', networkErr);
      }

      // Standalone Universal Engine Fallback (GitHub Pages bambiboy602.com / Offline)
      if (!botReply) {
        const localBrain = generateClientTomReply(query, messages, activeGemMode);
        botReply = localBrain.reply;
        detectedEmotion = localBrain.avatarEmotion;
        searchQueries = localBrain.searchQueries;
        searchSources = localBrain.searchSources;
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: botReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        emotion: detectedEmotion,
        searchQueries,
        searchSources,
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsThinking(false);
      setAvatarEmotion(detectedEmotion);

      // Speak aloud through the animated avatar with lip-sync
      speak(botReply, () => {
        setAvatarEmotion('idle');
      });
    } catch (err) {
      console.error('Chat error:', err);
      setIsThinking(false);
      setAvatarEmotion('thoughtful');
      const fallback = generateClientTomReply(query, messages, activeGemMode);
      const fallbackMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: fallback.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        emotion: fallback.avatarEmotion,
        searchQueries: fallback.searchQueries,
        searchSources: fallback.searchSources,
      };
      setMessages((prev) => [...prev, fallbackMsg]);
      speak(fallback.reply, () => setAvatarEmotion('idle'));
    }
  };

  const handleVoiceToggle = () => {
    if (isListening) {
      stopVoiceInput();
    } else {
      startVoiceInput((transcript) => {
        setInputMessage(transcript);
        handleSendMessage(transcript);
      });
    }
  };

  const handleToggleContinuousVoice = () => {
    const nextState = !continuousMode;
    setContinuousMode(nextState);
    if (nextState) {
      startVoiceInput((transcript) => {
        handleSendMessage(transcript);
      });
    } else {
      stopVoiceInput();
    }
  };

  const quickQuestions = isSudoActive
    ? [
        'I slipped up and relapsed.',
        'Gemini Skills Architecture',
        'Sudo Tom',
        'Emergency shelter in Phoenix',
        'Inspect System Patches',
        'Workbook exercises',
      ]
    : [
        'I slipped up and relapsed.',
        'Emergency shelter in Phoenix',
        'How does Domino Effect work?',
        'Detox and crisis centers',
        'Workbook exercises',
      ];

  return (
    <div
      id="interactive-ai-avatar"
      className="w-full max-w-md bg-white dark:bg-stone-900 rounded-3xl border-2 border-emerald-600/30 dark:border-emerald-500/20 shadow-2xl overflow-hidden flex flex-col transition-all"
    >
      {/* Top Header */}
      <div className="p-3.5 bg-stone-100 dark:bg-stone-950/80 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold text-xs shadow-sm">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-xs font-bold text-stone-900 dark:text-stone-100 font-serif">
                Tom AI Peer Mentor
              </h3>
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center gap-0.5">
                <Radio className="w-2.5 h-2.5 animate-pulse text-emerald-600" />
                Live Voice
              </span>
            </div>
            <p className="text-[10px] text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
              <span>On the curb</span>
              <span>•</span>
              {isSudoActive ? (
                <span className="text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-amber-500" />
                  Gemini Gem Router
                </span>
              ) : (
                <span className="text-stone-600 dark:text-stone-400 font-medium">
                  Phoenix Peer Support
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          {/* Always accessible voice & mute controls */}
          <button
            onClick={handleToggleContinuousVoice}
            className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
              continuousMode
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-stone-200/80 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
            title="Hands-free continuous conversation"
          >
            {continuousMode ? 'Voice: ON' : 'Hands-Free'}
          </button>

          <button
            onClick={toggleMute}
            className="p-1.5 rounded-lg text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-500" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-600" />}
          </button>

          {/* Sudo Mode Specific Action Controls (Cleaned from UI when sudo is off) */}
          {isSudoActive && (
            <>
              <button
                onClick={() => setShowCustomizer(!showCustomizer)}
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                  showCustomizer
                    ? 'bg-amber-500 text-stone-950 font-black shadow-xs'
                    : 'bg-stone-200/80 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:text-stone-900'
                }`}
                title="Change Tom's look and sound"
              >
                <Sliders className="w-3 h-3" />
                <span>Look & Sound</span>
              </button>



              <button
                onClick={() => setShowGemsModal(true)}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-emerald-700 hover:from-amber-400 hover:to-emerald-600 text-white text-[10px] font-bold shadow-xs transition-all hover:scale-105"
                title="Gemini Skills Architecture & Prompts"
              >
                <Sparkles className="w-3 h-3 text-amber-200" />
                <span>Gemini Skills</span>
              </button>

              <a
                href={NOTEBOOK_LLM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-blue-100 dark:bg-blue-950/70 border border-blue-300 dark:border-blue-800 text-blue-900 dark:text-blue-300 text-[10px] font-bold shadow-xs transition-all hover:scale-105"
                title="Open Tom & B.A.M.B.I. Master Knowledge Vault in Google NotebookLM"
              >
                <BookOpen className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                <span>NotebookLM</span>
                <ExternalLink className="w-2.5 h-2.5 text-blue-500" />
              </a>
            </>
          )}
        </div>
      </div>

      {/* Sudo Tom Slide-Down Developer Inspector Panel */}
      <AnimatePresence>
        {isSudoActive && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-b border-stone-800 bg-stone-950 text-stone-100"
          >
            <div className="p-3 sm:p-4 space-y-3 text-xs">
              {/* Header */}
              <div className="flex items-center justify-between pb-2 border-b border-stone-800">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    <Terminal className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-mono font-bold text-xs text-emerald-400 flex items-center gap-1.5">
                      <span>SUDO TOM // DEVELOPER INSPECTOR</span>
                    </h4>
                    <span className="text-[10px] text-stone-400">
                      Master System Spec v1.0 • Single Brain Orchestrator • NotebookLM Grounding
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700 font-mono">
                    gemini-3.8-flash
                  </span>
                  <button
                    onClick={handleToggleSudo}
                    className="p-1 rounded-md text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
                    title="Exit Sudo Mode"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* 1. Runtime Engine Specifications */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="p-2.5 rounded-xl bg-stone-900 border border-stone-800">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-stone-400">
                    <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Active LLM Engine</span>
                  </div>
                  <div className="text-[11.5px] font-bold text-stone-100 mt-1">Gemini 3.8 Flash</div>
                  <div className="text-[9.5px] text-emerald-400">Live Google Search Grounding</div>
                </div>

                <div className="p-2.5 rounded-xl bg-stone-900 border border-stone-800">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-stone-400">
                    <Shield className="w-3.5 h-3.5 text-amber-400" />
                    <span>Failover Safeguards</span>
                  </div>
                  <div className="text-[11.5px] font-bold text-stone-100 mt-1">Gemini 3.1 Flash Lite</div>
                  <div className="text-[9.5px] text-stone-400">+ Standalone RSM v1.0.0 (offline)</div>
                </div>

                <div className="p-2.5 rounded-xl bg-stone-900 border border-stone-800">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-stone-400">
                    <Layers className="w-3.5 h-3.5 text-purple-400" />
                    <span>8 Canonical Patches</span>
                  </div>
                  <div className="text-[11.5px] font-bold text-stone-100 mt-1">Single Nervous System</div>
                  <div className="text-[9.5px] text-stone-400">Under the Words • Tone Compression</div>
                </div>
              </div>

              {/* 2. Gem Specialization Selector (1 Unified Brain) */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-[10px] text-stone-400 font-mono">
                  <span>CANONICAL GEMS (SINGLE USER-FACING VOICE):</span>
                  <a
                    href={
                      activeGemMode === 'tom-core'
                        ? OFFICIAL_TOM_GEM_URL
                        : activeGemMode === 'the-grower'
                        ? GROWER_GEM_URL
                        : activeGemMode === 'master-vault'
                        ? MASTER_VAULT_GEM_URL
                        : BAMBI_GEM_URL
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-amber-400 hover:underline"
                  >
                    <span>Open Direct Gem</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  <button
                    onClick={() => setActiveGemMode('tom-core')}
                    className={`p-2 rounded-xl text-left border transition-all ${
                      activeGemMode === 'tom-core'
                        ? 'bg-emerald-950/90 border-emerald-500 text-white shadow-xs ring-1 ring-emerald-500/50'
                        : 'bg-stone-900 border-stone-800 text-stone-300 hover:bg-stone-800'
                    }`}
                  >
                    <div className="text-[9px] font-mono font-bold text-emerald-400">Gem 1</div>
                    <div className="text-[11px] font-bold truncate">Tom Core</div>
                    <div className="text-[9px] text-stone-400 truncate">Curb Mentor Voice</div>
                  </button>

                  <button
                    onClick={() => setActiveGemMode('bambi')}
                    className={`p-2 rounded-xl text-left border transition-all ${
                      activeGemMode === 'bambi' || activeGemMode === 'bambi-diagnostic'
                        ? 'bg-amber-950/90 border-amber-500 text-white shadow-xs ring-1 ring-amber-500/50'
                        : 'bg-stone-900 border-stone-800 text-stone-300 hover:bg-stone-800'
                    }`}
                  >
                    <div className="text-[9px] font-mono font-bold text-amber-400">Gem 2</div>
                    <div className="text-[11px] font-bold truncate">B.A.M.B.I.</div>
                    <div className="text-[9px] text-stone-400 truncate">5-Stage Adaptive</div>
                  </button>

                  <button
                    onClick={() => setActiveGemMode('the-grower')}
                    className={`p-2 rounded-xl text-left border transition-all ${
                      activeGemMode === 'the-grower'
                        ? 'bg-purple-950/90 border-purple-500 text-white shadow-xs ring-1 ring-purple-500/50'
                        : 'bg-stone-900 border-stone-800 text-stone-300 hover:bg-stone-800'
                    }`}
                  >
                    <div className="text-[9px] font-mono font-bold text-purple-400">Gem 3</div>
                    <div className="text-[11px] font-bold truncate">The Grower</div>
                    <div className="text-[9px] text-stone-400 truncate">Adaptive Auditor</div>
                  </button>

                  <button
                    onClick={() => setActiveGemMode('master-vault')}
                    className={`p-2 rounded-xl text-left border transition-all ${
                      activeGemMode === 'master-vault'
                        ? 'bg-blue-950/90 border-blue-500 text-white shadow-xs ring-1 ring-blue-500/50'
                        : 'bg-stone-900 border-stone-800 text-stone-300 hover:bg-stone-800'
                    }`}
                  >
                    <div className="text-[9px] font-mono font-bold text-blue-400">Gem 5</div>
                    <div className="text-[11px] font-bold truncate">Master Vault</div>
                    <div className="text-[9px] text-stone-400 truncate">Knowledge Library</div>
                  </button>
                </div>
                <div className="text-[9.5px] text-stone-500 italic px-1">
                  * Gem 4 is intentionally unassigned per Master System Specification v1.0. All modules coordinated by Gem 0/99 Maestro.
                </div>
              </div>

              {/* 3. Grounding Sources & Quick Actions */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-800 text-[10.5px]">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-stone-400 font-mono">Grounding Sources:</span>
                  <a
                    href="/Tom-Master-System-Specification.md"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-amber-400 hover:underline font-semibold"
                  >
                    <span>Master Spec v1.0</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                  <span className="text-stone-600">·</span>
                  <a
                    href="/Tom-Gem-Flow-One-Brain-Instructions.md"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-emerald-400 hover:underline font-semibold"
                  >
                    <span>Gem Flow Guide</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                  <span className="text-stone-600">·</span>
                  <a
                    href={NOTEBOOK_LLM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-blue-400 hover:underline font-semibold"
                  >
                    <BookOpen className="w-3 h-3" />
                    <span>NotebookLM Vault</span>
                  </a>
                  <span className="text-stone-600">·</span>
                  <span className="text-stone-300">89 AZ Resources</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setShowCustomizer(!showCustomizer)}
                    className="px-2 py-1 rounded-lg bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-200 transition-colors flex items-center gap-1"
                  >
                    <Sliders className="w-3 h-3 text-amber-400" />
                    <span>Avatar Look & Sound</span>
                  </button>

                  <button
                    onClick={() => setShowGemsModal(true)}
                    className="px-2 py-1 rounded-lg bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-200 transition-colors flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>Skills Hub</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gemini Skills Mode Selector Row - Visible only when Sudo is Active */}
      {isSudoActive && (
        <div className="px-3 py-1.5 bg-stone-50 dark:bg-stone-950/60 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between gap-1.5 text-[10px]">
          <div className="flex items-center gap-1 overflow-x-auto py-0.5">
            <span className="font-bold text-stone-500 dark:text-stone-400 flex items-center gap-1 shrink-0">
              <Sparkles className="w-2.5 h-2.5 text-amber-500" />
              <span>Skill:</span>
            </span>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => setActiveGemMode('maestro')}
                className={`px-1.5 py-0.5 rounded font-bold transition-all ${
                  activeGemMode === 'maestro'
                    ? 'bg-indigo-700 text-white shadow-xs'
                    : 'bg-stone-200/80 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-300'
                }`}
                title="Skill 0/99: Maestro (Universal Orchestrator v1.3)"
              >
                #0 Maestro v1.3
              </button>
              <button
                onClick={() => setActiveGemMode('tom-core')}
                className={`px-1.5 py-0.5 rounded font-bold transition-all ${
                  activeGemMode === 'tom-core'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-stone-200/80 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-300'
                }`}
                title="Skill 1: Tom Core (Authentic Street Realism)"
              >
                #1 Tom Core
              </button>
              <button
                onClick={() => setActiveGemMode('bambi')}
                className={`px-1.5 py-0.5 rounded font-bold transition-all ${
                  activeGemMode === 'bambi' || activeGemMode === 'bambi-diagnostic'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-stone-200/80 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-300'
                }`}
                title="Skill 2: B.A.M.B.I. (Process & Behavioral Engine)"
              >
                #2 B.A.M.B.I.
              </button>
              <button
                onClick={() => setActiveGemMode('the-grower')}
                className={`px-1.5 py-0.5 rounded font-bold transition-all ${
                  activeGemMode === 'the-grower'
                    ? 'bg-purple-700 text-white shadow-xs'
                    : 'bg-stone-200/80 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-300'
                }`}
                title="Skill 3: The Grower (Quality Controls & Defamation Guard)"
              >
                #3 The Grower
              </button>
              <button
                onClick={() => setActiveGemMode('master-vault')}
                className={`px-1.5 py-0.5 rounded font-bold transition-all ${
                  activeGemMode === 'master-vault'
                    ? 'bg-blue-700 text-white shadow-xs'
                    : 'bg-stone-200/80 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-300'
                }`}
                title="Skill 5: Master Knowledge Vault (Verified Phoenix Resources & NotebookLM Grounding)"
              >
                #5 Master Vault
              </button>
            </div>
          </div>

          <a
            href={
              activeGemMode === 'tom-core'
                ? OFFICIAL_TOM_GEM_URL
                : activeGemMode === 'the-grower'
                ? GROWER_GEM_URL
                : activeGemMode === 'master-vault'
                ? MASTER_VAULT_GEM_URL
                : BAMBI_GEM_URL
            }
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 dark:text-amber-400 hover:underline shrink-0"
            title={activeGemMode === 'master-vault' ? 'Open Master Knowledge Vault in NotebookLM' : 'Open active Gem directly'}
          >
            <span>{activeGemMode === 'master-vault' ? 'NotebookLM Vault' : 'Direct Gem'}</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>
      )}

      {/* Look & Sound Customizer Accordion Panel */}
      <AnimatePresence>
        {showCustomizer && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-b border-amber-300 dark:border-amber-900/50 bg-stone-50 dark:bg-stone-950 p-3 text-xs"
          >
            <div className="space-y-3">
              {/* Header */}
              <div className="flex items-center justify-between">
                <span className="font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-amber-500" />
                  Customize Tom Look & Sound
                </span>
                <button
                  onClick={handleTestVoice}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-700 text-white text-[10px] font-bold hover:bg-emerald-800 active:scale-95 transition-all shadow-xs"
                >
                  <Play className="w-2.5 h-2.5" />
                  Test Sound
                </button>
              </div>

              {/* Look Selection */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                    Avatar Design & Photos
                  </label>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                    Active: {avatarStyle.replace('-', ' ').toUpperCase()}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  {/* NEW WEBBEE VECTOR AVATAR */}
                  <button
                    onClick={() => setAvatarStyle('webbee')}
                    className={`p-2 rounded-lg text-left border transition-all ${
                      avatarStyle === 'webbee'
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-950 dark:text-emerald-200 ring-2 ring-emerald-500/50 font-bold'
                        : 'border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-900 text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm">🐝</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-600 text-white font-bold">NEW</span>
                    </div>
                    <div className="text-[11px] font-bold text-stone-900 dark:text-white mt-0.5">WebBee Mentor</div>
                    <div className="text-[9px] text-stone-500 dark:text-stone-400">Cyber hoodie & studio headset</div>
                  </button>

                  {/* WEBBEE ART PHOTO (webbee1.jpg) */}
                  <button
                    onClick={() => {
                      setAvatarStyle('webbee-photo');
                      setCustomPhotoUrl('/webbee1.jpg');
                    }}
                    className={`p-2 rounded-lg text-left border transition-all ${
                      avatarStyle === 'webbee-photo'
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-950 dark:text-emerald-200 ring-2 ring-emerald-500/50 font-bold'
                        : 'border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-900 text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm">🎨</span>
                      <span className="text-[9px] px-1 py-0.5 rounded bg-amber-500/20 text-amber-700 dark:text-amber-300 font-semibold">Photo</span>
                    </div>
                    <div className="text-[11px] font-bold text-stone-900 dark:text-white mt-0.5">WebBee Art</div>
                    <div className="text-[9px] text-stone-500 dark:text-stone-400">webbee1.jpg in cyber frame</div>
                  </button>

                  {/* BAMBI PHOTO (me55.jpg) */}
                  <button
                    onClick={() => {
                      setAvatarStyle('me55-photo');
                      setCustomPhotoUrl('/me55.jpg');
                    }}
                    className={`p-2 rounded-lg text-left border transition-all ${
                      avatarStyle === 'me55-photo'
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-950 dark:text-emerald-200 ring-2 ring-emerald-500/50 font-bold'
                        : 'border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-900 text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm">👤</span>
                      <span className="text-[9px] px-1 py-0.5 rounded bg-blue-500/20 text-blue-700 dark:text-blue-300 font-semibold">Photo</span>
                    </div>
                    <div className="text-[11px] font-bold text-stone-900 dark:text-white mt-0.5">Bambi Mentor</div>
                    <div className="text-[9px] text-stone-500 dark:text-stone-400">me55.jpg portrait</div>
                  </button>

                  {/* STREET MENTOR */}
                  <button
                    onClick={() => setAvatarStyle('street-mentor')}
                    className={`p-2 rounded-lg text-left border transition-all ${
                      avatarStyle === 'street-mentor'
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-950 dark:text-emerald-200 ring-2 ring-emerald-500/50 font-bold'
                        : 'border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-900 text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    <div className="text-sm">🧔</div>
                    <div className="text-[11px] font-bold text-stone-900 dark:text-white mt-0.5">Street Mentor</div>
                    <div className="text-[9px] text-stone-500 dark:text-stone-400">Beanie & curb jacket</div>
                  </button>

                  {/* CLEAN CAP */}
                  <button
                    onClick={() => setAvatarStyle('clean-cap')}
                    className={`p-2 rounded-lg text-left border transition-all ${
                      avatarStyle === 'clean-cap'
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-950 dark:text-emerald-200 ring-2 ring-emerald-500/50 font-bold'
                        : 'border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-900 text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    <div className="text-sm">🧢</div>
                    <div className="text-[11px] font-bold text-stone-900 dark:text-white mt-0.5">Clean Cap</div>
                    <div className="text-[9px] text-stone-500 dark:text-stone-400">Baseball cap & hoodie</div>
                  </button>

                  {/* PULSE ORB */}
                  <button
                    onClick={() => setAvatarStyle('orb')}
                    className={`p-2 rounded-lg text-left border transition-all ${
                      avatarStyle === 'orb'
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-950 dark:text-emerald-200 ring-2 ring-emerald-500/50 font-bold'
                        : 'border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-900 text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    <div className="text-sm">🔮</div>
                    <div className="text-[11px] font-bold text-stone-900 dark:text-white mt-0.5">Pulse Orb</div>
                    <div className="text-[9px] text-stone-500 dark:text-stone-400">Audio visualizer sphere</div>
                  </button>
                </div>

                {/* Custom Photo URL Input if Photo mode is chosen */}
                {(avatarStyle === 'photo' || avatarStyle === 'webbee-photo' || avatarStyle === 'me55-photo') && (
                  <div className="mt-2 flex gap-1.5 items-center bg-white dark:bg-stone-900 p-2 rounded-lg border border-stone-200 dark:border-stone-800">
                    <input
                      type="text"
                      value={customPhotoUrl}
                      onChange={(e) => setCustomPhotoUrl(e.target.value)}
                      placeholder="Photo path (e.g. /webbee1.jpg or /me55.jpg)"
                      className="flex-1 px-2 py-1 text-[11px] bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-md font-mono"
                    />
                    <button
                      onClick={() => {
                        setAvatarStyle('webbee-photo');
                        setCustomPhotoUrl('/webbee1.jpg');
                      }}
                      className="px-2 py-1 text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 rounded hover:bg-emerald-200 font-semibold"
                    >
                      webbee1.jpg
                    </button>
                    <button
                      onClick={() => {
                        setAvatarStyle('me55-photo');
                        setCustomPhotoUrl('/me55.jpg');
                      }}
                      className="px-2 py-1 text-[10px] bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 rounded hover:bg-amber-200 font-semibold"
                    >
                      me55.jpg
                    </button>
                  </div>
                )}
              </div>

              {/* Voice Personas (How Tom Sounds) */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1.5 flex items-center justify-between">
                  <span>Voice Tone & Persona (Deep Male)</span>
                  <span className="text-[9px] font-normal text-emerald-600 dark:text-emerald-400">Masculine Baritone Active</span>
                </label>
                <div className="grid grid-cols-3 gap-1.5 mb-2">
                  <button
                    onClick={() => applyVoicePreset(0.70, 0.90, 'Deep Male Baritone')}
                    className="p-1.5 rounded-lg border border-stone-200 dark:border-stone-800 hover:border-emerald-500 bg-white dark:bg-stone-900 text-left transition-all group"
                  >
                    <div className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 group-hover:text-emerald-600">Deep Baritone</div>
                    <div className="text-[9px] text-stone-500 dark:text-stone-400">Deep curb mentor</div>
                  </button>

                  <button
                    onClick={() => applyVoicePreset(0.75, 0.92, 'Deep Grounded Peer')}
                    className="p-1.5 rounded-lg border border-stone-200 dark:border-stone-800 hover:border-emerald-500 bg-white dark:bg-stone-900 text-left transition-all group"
                  >
                    <div className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 group-hover:text-emerald-600">Grounded Peer</div>
                    <div className="text-[9px] text-stone-500 dark:text-stone-400">Calm & steady brother</div>
                  </button>

                  <button
                    onClick={() => applyVoicePreset(0.82, 0.98, 'Warm Street Brother')}
                    className="p-1.5 rounded-lg border border-stone-200 dark:border-stone-800 hover:border-emerald-500 bg-white dark:bg-stone-900 text-left transition-all group"
                  >
                    <div className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 group-hover:text-emerald-600">Warm Street</div>
                    <div className="text-[9px] text-stone-500 dark:text-stone-400">Natural curb cadence</div>
                  </button>
                </div>

                {/* Pitch & Rate Fine Tuning Sliders */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-white dark:bg-stone-900 p-2.5 rounded-lg border border-stone-200 dark:border-stone-800">
                  <div>
                    <div className="flex justify-between text-[10px] text-stone-600 dark:text-stone-300 font-medium mb-1">
                      <span>Pitch: {pitch.toFixed(2)}x</span>
                      <span className="text-[9px] text-stone-400">{pitch <= 0.75 ? 'Deep Baritone' : pitch <= 0.88 ? 'Grounded Male' : 'Higher'}</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="1.2"
                      step="0.05"
                      value={pitch}
                      onChange={(e) => setPitch(parseFloat(e.target.value))}
                      className="w-full accent-emerald-600 h-1.5 bg-stone-200 dark:bg-stone-800 rounded-lg cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-[10px] text-stone-600 dark:text-stone-300 font-medium mb-1">
                      <span>Speed: {rate.toFixed(2)}x</span>
                      <span className="text-[9px] text-stone-400">{rate < 0.92 ? 'Unhurried Curb' : rate > 1.05 ? 'Fast' : 'Conversational'}</span>
                    </div>
                    <input
                      type="range"
                      min="0.7"
                      max="1.3"
                      step="0.05"
                      value={rate}
                      onChange={(e) => setRate(parseFloat(e.target.value))}
                      className="w-full accent-emerald-600 h-1.5 bg-stone-200 dark:bg-stone-800 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>

                {/* System Voice Dropdown if available */}
                {voices && voices.length > 0 && (
                  <div className="mt-2">
                    <label className="block text-[9px] font-bold text-stone-500 dark:text-stone-400 mb-1">
                      Installed Voice Model ({voices.length} voices found on device)
                    </label>
                    <select
                      value={selectedVoiceIndex}
                      onChange={(e) => setSelectedVoiceIndex(parseInt(e.target.value, 10))}
                      className="w-full text-[10px] p-1.5 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-md text-stone-800 dark:text-stone-200 font-mono"
                    >
                      {voices.map((v, i) => (
                        <option key={i} value={i}>
                          {v.name} ({v.lang}) {v.default ? '★ Default' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Avatar Curb Stage (Compact) */}
      <div className="relative pt-3 pb-2 px-4 bg-gradient-to-b from-stone-50 via-stone-100/80 to-emerald-50/30 dark:from-stone-950 dark:via-stone-900 dark:to-emerald-950/20 flex flex-col items-center justify-center border-b border-stone-200/70 dark:border-stone-800">
        <div className="transform scale-90 sm:scale-95 origin-center">
          <AnimatedAvatar
            emotion={avatarEmotion}
            isSpeaking={isSpeaking}
            mouthOpenAmount={mouthOpenAmount}
            isListening={isListening}
            isThinking={isThinking}
            onAvatarClick={handleAvatarClick}
            statusText="Tom • On The Curb"
            avatarStyle={avatarStyle}
            customPhotoUrl={customPhotoUrl}
          />
        </div>

        {/* Quick Avatar Switcher Bar */}
        <div className="mt-2 flex items-center justify-center gap-1 flex-wrap">
          <span className="text-[9px] font-bold text-stone-400 dark:text-stone-500 uppercase mr-1">Look:</span>
          <button
            onClick={() => setAvatarStyle('webbee')}
            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold transition-all ${
              avatarStyle === 'webbee'
                ? 'bg-emerald-600 text-white shadow-xs font-bold'
                : 'bg-white/80 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
            }`}
          >
            🐝 WebBee
          </button>
          <button
            onClick={() => {
              setAvatarStyle('webbee-photo');
              setCustomPhotoUrl('/webbee1.jpg');
            }}
            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold transition-all ${
              avatarStyle === 'webbee-photo'
                ? 'bg-amber-600 text-white shadow-xs font-bold'
                : 'bg-white/80 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
            }`}
          >
            🎨 WebBee Art
          </button>
          <button
            onClick={() => {
              setAvatarStyle('me55-photo');
              setCustomPhotoUrl('/me55.jpg');
            }}
            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold transition-all ${
              avatarStyle === 'me55-photo'
                ? 'bg-blue-600 text-white shadow-xs font-bold'
                : 'bg-white/80 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
            }`}
          >
            👤 Bambi
          </button>
          <button
            onClick={() => setAvatarStyle('street-mentor')}
            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold transition-all ${
              avatarStyle === 'street-mentor'
                ? 'bg-stone-800 text-white shadow-xs font-bold'
                : 'bg-white/80 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
            }`}
          >
            🧔 Curb
          </button>
          <button
            onClick={() => setAvatarStyle('clean-cap')}
            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold transition-all ${
              avatarStyle === 'clean-cap'
                ? 'bg-stone-800 text-white shadow-xs font-bold'
                : 'bg-white/80 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
            }`}
          >
            🧢 Cap
          </button>
        </div>

        {/* Curb Status Pill */}
        <div className="mt-1.5 flex items-center gap-1.5 text-[10px] text-stone-500 dark:text-stone-400 bg-white/80 dark:bg-stone-800/80 px-2.5 py-0.5 rounded-full border border-stone-200 dark:border-stone-700">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
          <span>{isSpeaking ? 'Tom is talking...' : isListening ? 'Listening to you...' : isThinking ? 'Searching Google & thinking...' : 'Tap Tom or mic to speak'}</span>
        </div>
      </div>

      {/* Chat Messages History */}
      <div className="p-3 space-y-2.5 overflow-y-auto h-48 sm:h-52 bg-white dark:bg-stone-900/90 text-xs">
        {messages.map((msg) => {
          const isBot = msg.sender === 'bot';
          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-2 ${isBot ? 'justify-start' : 'justify-end'}`}
            >
              {isBot && (
                <div className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center shrink-0 text-[10px] font-bold mt-0.5 overflow-hidden shadow-xs">
                  {avatarStyle === 'webbee' ? '🐝' : avatarStyle === 'webbee-photo' ? '🎨' : avatarStyle === 'me55-photo' ? '👤' : avatarStyle === 'street-mentor' ? '🧔' : '🧢'}
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-xl p-2.5 text-xs leading-relaxed ${
                  isBot
                    ? 'bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-200/60 dark:border-stone-700/60'
                    : 'bg-emerald-700 text-white shadow-xs'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>

                {/* Google Search Grounding Sources (Sudo Mode Only) */}
                {isBot && isSudoActive && msg.searchSources && msg.searchSources.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-stone-200 dark:border-stone-700 space-y-1">
                    <div className="flex items-center gap-1 text-[10px] font-bold text-blue-600 dark:text-blue-400">
                      <Search className="w-2.5 h-2.5" />
                      <span>Live Google Resources:</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {msg.searchSources.slice(0, 3).map((source, idx) => (
                        <a
                          key={idx}
                          href={source.uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[9px] hover:underline"
                        >
                          <Globe className="w-2 h-2 text-blue-500" />
                          <span className="truncate max-w-[120px]">{source.title || 'Source'}</span>
                          <ExternalLink className="w-2 h-2 opacity-60" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-1 flex items-center justify-between text-[9px] opacity-60">
                  <span>{msg.timestamp}</span>
                  {msg.isVoiceInput && <span>🎤 Spoken</span>}
                </div>
              </div>

              {!isBot && (
                <div className="w-6 h-6 rounded-full bg-stone-300 dark:bg-stone-700 text-stone-800 dark:text-stone-200 flex items-center justify-center shrink-0 text-[9px] font-semibold mt-0.5">
                  <User className="w-3 h-3" />
                </div>
              )}
            </motion.div>
          );
        })}

        {/* Thinking Indicator */}
        {isThinking && (
          <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400 bg-stone-50 dark:bg-stone-800/60 p-2 rounded-xl border border-stone-200 dark:border-stone-700">
            <Sparkles className="w-3 h-3 text-amber-500 animate-spin" />
            <span>Tom is thinking & checking resources...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts */}
      <div className="px-3 py-1.5 bg-stone-50 dark:bg-stone-950/40 border-t border-stone-200 dark:border-stone-800">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="shrink-0 text-[10px] px-2 py-0.5 rounded-full bg-white dark:bg-stone-800 hover:bg-emerald-50 dark:hover:bg-emerald-950 text-stone-700 dark:text-stone-300 hover:text-emerald-700 border border-stone-200 dark:border-stone-700 transition-colors whitespace-nowrap"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input Bar */}
      <div className="p-2.5 bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-1.5"
        >
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={isListening ? "Listening..." : "Ask Tom or tap mic..."}
              className="w-full py-2 pl-3 pr-9 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-xs focus:outline-none focus:ring-1.5 focus:ring-emerald-500"
            />
            <button
              type="button"
              onClick={handleVoiceToggle}
              className={`absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-all ${
                isListening
                  ? 'bg-rose-600 text-white animate-pulse'
                  : 'text-stone-500 hover:text-emerald-600'
              }`}
              title={isListening ? "Stop listening" : "Speak to Tom"}
            >
              {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
            </button>
          </div>

          <button
            type="submit"
            disabled={!inputMessage.trim() || isThinking}
            className="p-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white shadow-sm transition-all shrink-0"
            title="Send"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

      {/* Floating Discrete Sudo Tom Switch at Bottom of Chat */}
      <div className="px-3 py-1.5 bg-stone-100/90 dark:bg-stone-950/80 border-t border-stone-200 dark:border-stone-800/80 flex items-center justify-between text-[10px]">
        <div className="flex items-center gap-1.5 text-stone-500 dark:text-stone-400">
          <Terminal className="w-3 h-3 text-stone-400" />
          <span className="font-mono">mode:</span>
          <span className={`font-mono font-bold ${isSudoActive ? 'text-emerald-700 dark:text-emerald-400' : 'text-stone-600 dark:text-stone-400'}`}>
            {isSudoActive ? 'sudo tom (developer active)' : 'curb mentor (peer support)'}
          </span>
        </div>

        <button
          onClick={handleToggleSudo}
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold transition-all ${
            isSudoActive
              ? 'bg-emerald-700 text-white shadow-xs ring-1 ring-emerald-500/50'
              : 'bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100'
          }`}
          title={isSudoActive ? "Deactivate Sudo Developer Mode" : "Activate Sudo Developer Mode (reveal engine specs, gems, & sources)"}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${isSudoActive ? 'bg-white animate-pulse' : 'bg-stone-400'}`} />
          <span>sudo tom: {isSudoActive ? 'ON' : 'OFF'}</span>
        </button>
      </div>

      {/* Gemini Skills & Maestro v1.3 Universal Modal */}
      <GoogleGemsModal
        isOpen={showGemsModal}
        onClose={() => setShowGemsModal(false)}
        activeGemId={activeGemMode}
        onSelectGem={(gemId) => setActiveGemMode(gemId)}
      />


    </div>
  );
};
