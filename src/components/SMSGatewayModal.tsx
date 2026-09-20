import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  MessageSquare, 
  Phone, 
  Send, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink,
  ShieldCheck,
  Radio,
  Server,
  X
} from 'lucide-react';

interface SMSGatewayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SMSLogItem {
  id: string;
  timestamp: string;
  direction: 'inbound' | 'outbound';
  sender: string;
  recipient: string;
  message: string;
  status: 'received' | 'delivered' | 'failed';
  gateway: string;
}

export const SMSGatewayModal: React.FC<SMSGatewayModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'info' | 'test' | 'logs'>('info');
  const [recipientNumber, setRecipientNumber] = useState('+16024846251');
  const [testMessage, setTestMessage] = useState("Hey, this is a test check-in from Tom's curb gateway.");
  const [isSending, setIsSending] = useState(false);
  const [sendResult, setSendResult] = useState<{ success?: boolean; error?: string; message?: string } | null>(null);
  
  const [logs, setLogs] = useState<SMSLogItem[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);
  const [stats, setStats] = useState<{ total: number; inbound: number; outbound: number; delivered: number; failed: number } | null>(null);

  const fetchLogs = async () => {
    setIsLoadingLogs(true);
    try {
      const res = await fetch('/api/admin/sms-logs');
      if (res.ok) {
        const data = await res.json();
        if (data.logs) setLogs(data.logs);
        if (data.stats) setStats(data.stats);
      }
    } catch (err) {
      console.error('Failed to load SMS logs:', err);
    } finally {
      setIsLoadingLogs(false);
    }
  };

  useEffect(() => {
    if (isOpen && activeTab === 'logs') {
      fetchLogs();
    }
  }, [isOpen, activeTab]);

  const handleSendTestSMS = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientNumber || !testMessage) return;

    setIsSending(true);
    setSendResult(null);

    try {
      const res = await fetch('/api/admin/send-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipient: recipientNumber,
          message: testMessage,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSendResult({ success: true, message: 'Message queued and delivered to gateway!' });
        fetchLogs();
      } else {
        setSendResult({ success: false, error: data.error || 'Failed to dispatch SMS' });
      }
    } catch (err: any) {
      setSendResult({ success: false, error: err?.message || 'Network connection failed' });
    } finally {
      setIsSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-4 bg-emerald-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-700/80">
              <MessageSquare className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <h3 className="font-bold text-base flex items-center gap-2">
                <span>Tom's SMS Phone Gateway</span>
                <span className="text-[10px] bg-emerald-600 px-2 py-0.5 rounded-full font-mono flex items-center gap-1">
                  <Radio className="w-2.5 h-2.5 animate-pulse text-emerald-300" />
                  TextBee & Twilio
                </span>
              </h3>
              <p className="text-xs text-emerald-100">
                Direct text message interface & peer support hotline for mobile phones
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-emerald-700 text-emerald-200 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 px-4 pt-2 gap-2 text-xs font-bold">
          <button
            onClick={() => setActiveTab('info')}
            className={`pb-2.5 px-3 border-b-2 transition-all ${
              activeTab === 'info'
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-300'
            }`}
          >
            Phone Gateway Setup
          </button>
          <button
            onClick={() => setActiveTab('test')}
            className={`pb-2.5 px-3 border-b-2 transition-all ${
              activeTab === 'test'
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-300'
            }`}
          >
            Send Test SMS
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`pb-2.5 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'logs'
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-300'
            }`}
          >
            <span>Live Logs & Telemetry</span>
            {stats && stats.total > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px]">
                {stats.total}
              </span>
            )}
          </button>
        </div>

        {/* Content Area */}
        <div className="p-5 overflow-y-auto flex-1 text-sm text-stone-700 dark:text-stone-300 space-y-4">
          {activeTab === 'info' && (
            <div className="space-y-4">
              <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 p-4 rounded-xl space-y-2">
                <div className="flex items-center gap-2 font-bold text-emerald-800 dark:text-emerald-300">
                  <ShieldCheck className="w-4 h-4" />
                  <span>How Tom's Text Message Gateway Works</span>
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                  Anyone can text Tom directly from any standard cell phone. When a message is sent to your connected phone number or TextBee device, Tom processes the text through the <strong>Tom Core Runtime</strong> (gritty, unhurried, street-level peer support) and texts back automatically.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950/60 space-y-1.5">
                  <div className="font-bold text-xs text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                    <Server className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Inbound Webhook Endpoint</span>
                  </div>
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-mono break-all bg-white dark:bg-stone-900 p-2 rounded border border-stone-200 dark:border-stone-800 font-bold select-all">
                    {typeof window !== 'undefined' ? `${window.location.origin}/api/sms` : '/api/sms'}
                  </p>
                  <p className="text-[11px] text-stone-500">
                    Paste this exact URL into your <strong>TextBee.dev Dashboard &gt; Webhook URL</strong>. Every text sent to your phone will route to Tom and reply automatically!
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950/60 space-y-1.5">
                  <div className="font-bold text-xs text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-blue-600" />
                    <span>Voice & TTS Hotline</span>
                  </div>
                  <p className="text-[11px] text-stone-500 font-mono break-all bg-white dark:bg-stone-900 p-2 rounded border border-stone-200 dark:border-stone-800">
                    /api/voice & /api/make-call
                  </p>
                  <p className="text-[11px] text-stone-500">
                    Handles inbound calls or automated outbound wellness checks using Amazon Polly neural voice synthesis.
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <h4 className="font-bold text-stone-900 dark:text-stone-100">Bambi Recovery Phone Contacts:</h4>
                <div className="p-3 rounded-lg bg-stone-100 dark:bg-stone-800 font-mono text-xs flex justify-between items-center">
                  <span>Bambi Direct Cell / Text:</span>
                  <a href="tel:602-767-2147" className="font-bold text-emerald-700 dark:text-emerald-400 hover:underline">
                    (602) 767-2147
                  </a>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'test' && (
            <form onSubmit={handleSendTestSMS} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Recipient Phone Number (E.164 format, e.g. +16024846251)
                </label>
                <input
                  type="text"
                  value={recipientNumber}
                  onChange={(e) => setRecipientNumber(e.target.value)}
                  placeholder="+16027672147"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-950 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Message Content
                </label>
                <textarea
                  rows={3}
                  value={testMessage}
                  onChange={(e) => setTestMessage(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-950"
                  required
                />
              </div>

              {sendResult && (
                <div
                  className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
                    sendResult.success
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300'
                      : 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-300'
                  }`}
                >
                  {sendResult.success ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                  <span>{sendResult.message || sendResult.error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSending}
                className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shadow-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {isSending ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Dispatching via Gateway...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Test SMS to {recipientNumber}</span>
                  </>
                )}
              </button>
            </form>
          )}

          {activeTab === 'logs' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-600 dark:text-stone-400">
                  Recent Gateway Transmissions ({logs.length})
                </span>
                <button
                  onClick={fetchLogs}
                  disabled={isLoadingLogs}
                  className="px-2.5 py-1 text-[11px] rounded bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 font-bold flex items-center gap-1 transition-colors"
                >
                  <RefreshCw className={`w-3 h-3 ${isLoadingLogs ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
              </div>

              {logs.length === 0 ? (
                <div className="p-8 text-center text-xs text-stone-400 bg-stone-50 dark:bg-stone-950 rounded-xl border border-stone-200 dark:border-stone-800">
                  No SMS transactions logged yet in this session.
                </div>
              ) : (
                <div className="space-y-2 max-h-72 overflow-y-auto">
                  {logs.map((log) => (
                    <div
                      key={log.id}
                      className="p-2.5 rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 text-xs flex flex-col gap-1"
                    >
                      <div className="flex items-center justify-between text-[10px]">
                        <span
                          className={`font-bold px-1.5 py-0.2 rounded uppercase ${
                            log.direction === 'inbound'
                              ? 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300'
                              : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                          }`}
                        >
                          {log.direction} • {log.gateway}
                        </span>
                        <span className="text-stone-400">{new Date(log.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <p className="font-mono text-[11px] text-stone-900 dark:text-stone-100 font-medium">
                        {log.message}
                      </p>
                      <div className="text-[10px] text-stone-500 flex justify-between">
                        <span>From: {log.sender}</span>
                        <span>To: {log.recipient}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-stone-50 dark:bg-stone-950 border-t border-stone-200 dark:border-stone-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-bold rounded-lg bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-300 transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};
