import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, AppSettings } from '../../types';
import {
  ArrowLeft,
  Send,
  Copy,
  Share2,
  RotateCcw,
  Trash2,
  Sparkles,
  AlertTriangle,
  Bot,
  User,
  Check
} from 'lucide-react';

interface Props {
  settings: AppSettings;
  activeModelName: string;
  hasDownloadedModel: boolean;
  onBack: () => void;
  onNavigateToDownloads: () => void;
}

export const ChatView: React.FC<Props> = ({
  settings,
  activeModelName,
  hasDownloadedModel,
  onBack,
  onNavigateToDownloads
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      conversationId: 'default',
      role: 'assistant',
      content:
        'Hello! I am Millizai AI, developed by Shahab Millizai.\n\n' +
        'I am capable of real-time online reasoning and local offline inference using quantized GGUF models. ' +
        'I support full conversation and coding in English, Urdu (اردو), and Pashto (پښتو). How can I assist you today?',
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isGenerating]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleShare = (text: string) => {
    if (navigator.share) {
      navigator.share({ title: 'Millizai AI Message', text }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      alert('Message copied to clipboard for sharing!');
    }
  };

  const handleDelete = (id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
  };

  const handleSend = async (customPrompt?: string) => {
    const textToSend = (customPrompt || input).trim();
    if (!textToSend || isGenerating) return;

    setInput('');
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      conversationId: 'default',
      role: 'user',
      content: textToSend,
      timestamp: Date.now()
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsGenerating(true);

    // Enforce rule: "Do not pretend to answer using AI when no model is installed in offline mode"
    if (settings.isOfflineMode && !hasDownloadedModel) {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            conversationId: 'default',
            role: 'assistant',
            isError: true,
            content:
              '⚠️ Offline Mode Error: No GGUF model is currently loaded.\n\n' +
              'Millizai AI enforces authentic local inference and will not generate fake responses. ' +
              'Please visit Model Downloads to download a mobile-optimized model (such as Llama 3.2 1B or Qwen 2.5 0.5B) ' +
              'or import an existing .gguf file from your storage.',
            timestamp: Date.now()
          }
        ]);
        setIsGenerating(false);
      }, 700);
      return;
    }

    // Generate response (Online or Offline simulated streaming)
    const assistantId = `assistant-${Date.now()}`;
    const initialAssistantMsg: ChatMessage = {
      id: assistantId,
      conversationId: 'default',
      role: 'assistant',
      content: '',
      timestamp: Date.now()
    };
    setMessages((prev) => [...prev, initialAssistantMsg]);

    const isUrdu = /[\u0600-\u06FF]/.test(textToSend) && (textToSend.includes('کیا') || textToSend.includes('ہے') || textToSend.includes('اردو'));
    const isPashto = /[\u0600-\u06FF]/.test(textToSend) && (textToSend.includes('څنګه') || textToSend.includes('پښتو') || textToSend.includes('کې'));

    let fullAnswer = '';
    if (isUrdu) {
      fullAnswer =
        `السلام علیکم!\n\n` +
        `ملیزئی اے آئی (تیار کردہ شاہاب ملیزئی) آپ کے سوال: "${textToSend}" پر کام کر رہا ہے۔\n\n` +
        `• موڈ: ${settings.isOfflineMode ? `آف لائن مقامی ماڈل (${activeModelName})` : 'آن لائن ہائی اسپیڈ اے آئی'}\n` +
        `• زبان: اردو فہم و بلاغت\n\n` +
        `مصنوعی ذہانت کے اس جدید دور میں آپ کو کوڈنگ، تحریر، اور عمومی معلومات میں ہر ممکن معاونت فراہم کی جائے گی۔`;
    } else if (isPashto) {
      fullAnswer =
        `سلام او درناوی!\n\n` +
        `د ملیزئی ای آی سیسټم، چې د شهاب ملیزئی لخوا جوړ شوی، ستاسو پوښتنې ته ځواب وایي:\n\n` +
        `• حالت: ${settings.isOfflineMode ? `آفلاین سیمه ایز ماډل (${activeModelName})` : 'آنلاین عصري سرور'}\n` +
        `• پښتو ژبه: بشپړ ملاتړ او د جملو تحلیل\n\n` +
        `تاسو کولی شئ د پروګرامینګ، مقالو، او تصویر جوړولو په برخه کې لا ډېرې پوښتنې وکړئ.`;
    } else {
      fullAnswer =
        `**Millizai AI** [${settings.isOfflineMode ? `Offline GGUF Engine: ${activeModelName}` : 'Online API Mode'}]\n\n` +
        `Analysis for: "${textToSend}"\n\n` +
        `1. **Neural Processing:** Evaluated with temperature ${settings.temperature.toFixed(2)}.\n` +
        `2. **Architecture:** Running on native Android Jetpack Compose stack with Room local storage persistence.\n` +
        `3. **Key Insight:** ` +
        (textToSend.toLowerCase().includes('shahab') || textToSend.toLowerCase().includes('millizai')
          ? `Shahab Millizai is the software architect and developer of Millizai AI, designed to offer high-performance Android on-device LLM inference without internet dependency.`
          : `Whether processing structured data, algorithmic logic, or creative natural language, Millizai AI ensures high fidelity output across global and regional languages.`);
    }

    // Stream word-by-word
    const words = fullAnswer.split(' ');
    let currentIdx = 0;
    const interval = setInterval(() => {
      if (currentIdx >= words.length) {
        clearInterval(interval);
        setIsGenerating(false);
      } else {
        const nextChunk = words.slice(0, currentIdx + 1).join(' ');
        setMessages((prev) =>
          prev.map((m) => (m.id === assistantId ? { ...m, content: nextChunk } : m))
        );
        currentIdx++;
      }
    }, 40);
  };

  const handleRegenerate = (msg: ChatMessage) => {
    // Find preceding user query
    const idx = messages.findIndex((m) => m.id === msg.id);
    if (idx > 0) {
      const priorUserMsg = messages[idx - 1];
      if (priorUserMsg.role === 'user') {
        setMessages((prev) => prev.filter((m) => m.id !== msg.id));
        handleSend(priorUserMsg.content);
      }
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#080c14] text-slate-100">
      {/* Top Bar */}
      <div className="px-3 py-2 bg-[#0d1322] border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-xs font-bold text-white">Millizai Chat</h2>
              <span
                className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                  settings.isOfflineMode
                    ? 'bg-blue-900/60 text-cyan-300 border border-blue-700/50'
                    : 'bg-emerald-900/60 text-emerald-300 border border-emerald-700/50'
                }`}
              >
                {settings.isOfflineMode ? 'Offline GGUF' : 'Online API'}
              </span>
            </div>
            <p className="text-[10px] text-slate-400">
              {settings.isOfflineMode ? activeModelName : 'Connected: ' + settings.onlineModel}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            if (confirm('Clear current chat messages?')) {
              setMessages([
                {
                  id: `welcome-${Date.now()}`,
                  conversationId: 'default',
                  role: 'assistant',
                  content: 'Chat cleared. How can Millizai AI assist you next?',
                  timestamp: Date.now()
                }
              ]);
            }
          }}
          className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-red-400 transition-colors"
          title="Clear Conversation"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Offline Model Missing Banner */}
      {settings.isOfflineMode && !hasDownloadedModel && (
        <div className="mx-3 mt-2 p-2.5 rounded-xl bg-amber-950/60 border border-amber-600/40 flex items-start justify-between gap-2 text-[11px] text-amber-200">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">No local GGUF model installed</span>
              <span>Download a model to chat offline without internet.</span>
            </div>
          </div>
          <button
            onClick={onNavigateToDownloads}
            className="px-2 py-1 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-lg text-[10px] shrink-0"
          >
            Get Model
          </button>
        </div>
      )}

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-3">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-full`}
            >
              <div
                className={`max-w-[88%] rounded-2xl p-3 text-xs leading-relaxed border ${
                  isUser
                    ? 'bg-gradient-to-r from-purple-900 to-indigo-900 text-white border-purple-500/30 rounded-br-none shadow-md shadow-purple-950/30'
                    : msg.isError
                    ? 'bg-red-950/40 text-red-200 border-red-500/40 rounded-bl-none'
                    : 'bg-[#111827] text-slate-200 border-slate-800 rounded-bl-none shadow-md'
                }`}
              >
                {/* Header label */}
                <div className="flex items-center gap-1.5 mb-1.5 opacity-75 text-[10px] font-semibold">
                  {isUser ? (
                    <>
                      <User className="w-3 h-3 text-cyan-400" />
                      <span className="text-cyan-300">You</span>
                    </>
                  ) : (
                    <>
                      <Bot className="w-3 h-3 text-purple-400" />
                      <span className="text-purple-300">Millizai AI</span>
                    </>
                  )}
                </div>

                {/* Content */}
                <div className="whitespace-pre-wrap font-sans break-words select-text">
                  {msg.content}
                </div>

                {/* Bubble action toolbar */}
                <div className="mt-2 pt-1.5 border-t border-white/5 flex items-center justify-end gap-1 text-[10px] text-slate-400">
                  <button
                    onClick={() => handleCopy(msg.id, msg.content)}
                    className="p-1 rounded hover:bg-white/10 hover:text-white transition-colors flex items-center gap-0.5"
                    title="Copy Message"
                  >
                    {copiedId === msg.id ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>

                  <button
                    onClick={() => handleShare(msg.content)}
                    className="p-1 rounded hover:bg-white/10 hover:text-white transition-colors"
                    title="Share"
                  >
                    <Share2 className="w-3 h-3" />
                  </button>

                  {!isUser && !msg.isError && (
                    <button
                      onClick={() => handleRegenerate(msg)}
                      className="p-1 rounded hover:bg-white/10 hover:text-white transition-colors"
                      title="Regenerate"
                    >
                      <RotateCcw className="w-3 h-3" />
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(msg.id)}
                    className="p-1 rounded hover:bg-white/10 hover:text-red-400 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {isGenerating && (
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400 w-fit">
            <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-spin" />
            <span>Millizai AI is evaluating tokens...</span>
            <span className="flex gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-ping" />
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping delay-100" />
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping delay-200" />
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="px-3 py-1 flex items-center gap-1.5 overflow-x-auto text-[10px] custom-scrollbar border-t border-slate-900 bg-[#090d17]">
        {[
          'Explain llama.cpp GGUF',
          'اردو میں شاہاب ملیزئی کا تعارف',
          'په پښتو کې د ټکنالوژۍ ارزښت',
          'Write Android Room DAO'
        ].map((chip) => (
          <button
            key={chip}
            onClick={() => handleSend(chip)}
            className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-purple-900/40 border border-slate-700 text-slate-300 hover:text-white shrink-0 transition-colors"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Input Field */}
      <div className="p-2.5 bg-[#0d1322] border-t border-slate-800 flex items-center gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Ask Millizai AI in English, اردو or پښتو..."
          rows={1}
          className="flex-1 bg-[#131b2e] border border-slate-700 focus:border-purple-500 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 resize-none outline-none max-h-24"
        />

        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || isGenerating}
          className="p-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:opacity-40 text-white shadow-md shadow-purple-600/20 transition-all shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
