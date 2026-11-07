import React, { useState } from 'react';
import { AppSettings } from '../../types';
import { ArrowLeft, PenTool, Copy, Check, Sparkles, Globe } from 'lucide-react';

interface Props {
  settings: AppSettings;
  onBack: () => void;
}

export const WritingView: React.FC<Props> = ({ onBack }) => {
  const [topic, setTopic] = useState('Impact of on-device AI for developing regions');
  const [format, setFormat] = useState('Professional Essay');
  const [language, setLanguage] = useState<'English' | 'Urdu' | 'Pashto'>('English');
  const [tone, setTone] = useState('Inspiring');
  const [isGenerating, setIsGenerating] = useState(false);
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const formats = ['Professional Essay', 'Executive Email', 'Creative Story', 'Poetry / Shayari', 'Social Post'];
  const tones = ['Inspiring', 'Formal', 'Technical', 'Conversational', 'Persuasive'];

  const handleGenerate = () => {
    if (!topic.trim() || isGenerating) return;
    setIsGenerating(true);

    setTimeout(() => {
      if (language === 'Urdu') {
        setOutput(
          `عنوان: ${topic}\nانداز: ${tone} | فارمیٹ: ${format}\n\n` +
          `محترم قارئین،\n` +
          `ملیزئی اے آئی، جسے شاہاب ملیزئی نے تخلیق کیا ہے، زبان و ادب اور جدید ترین مصنوعی ذہانت کا ایک شاندار سنگم ہے۔ ` +
          `اس نظام کی خاص بات یہ ہے کہ یہ اردو زبان کی پیچیدگیوں، محاورات اور گہرے مفاہیم کو بخوبی سمجھتا ہے۔\n\n` +
          `"علم و فن کی روشنی سے جگمگائے زندگی\n` +
          `فکر کی گہرائیوں میں مسکرائے زندگی"\n\n` +
          `ہم اس بات کے پختہ عزم کے ساتھ آگے بڑھ رہے ہیں کہ جدید دور کی ٹیکنالوجی کو ہر ایک کی دسترس میں لایا جائے، ` +
          `چاہے وہ انٹرنیٹ سے منسلک ہو یا آف لائن اپنے موبائل فون پر بغیر کسی پریشانی کے کام کر رہا ہو۔\n\n` +
          `شاہاب ملیزئی\nملیزئی اے آئی سسٹم`
        );
      } else if (language === 'Pashto') {
        setOutput(
          `موضوع: ${topic}\nبڼه: ${format} | لحن: ${tone}\n\n` +
          `درنو لوستونکو،\n` +
          `دا لیکنه د شهاب ملیزئی لخوا جوړ شوي نوښتګر سیسټم "ملیزئی ای آی" لخوا چمتو شوې ده. ` +
          `پښتو ژبه د بډایه تاریخ او عالي کلتور شاعري او درناوی لري، او دا سیسټم کوښښ کوي چې زموږ ژبه د معاصرې ټکنالوژۍ سره مله کړي.\n\n` +
          `"په علم او پوهه به جوړ کړو خپل ګران وطنه\n` +
          `د تیارو نه به راوباسو دا روښانه چمنه"\n\n` +
          `دا نوښت نه یوازې ستاسو د فکر کچه لوړوي، بلکې په آفلاین بڼه د نړۍ نوي علوم ستاسو د ګوتو سر ته راولي.\n\n` +
          `په درنښت،\nد ملیزئی ای آی د پرمختیا ټیم`
        );
      } else {
        setOutput(
          `# ${topic}\n` +
          `**Document Type:** ${format} | **Tone:** ${tone} | **Engine:** Millizai AI\n\n` +
          `## Executive Summary\n` +
          `Authored under the architectural guidance of Shahab Millizai, this synthesis examines how local machine learning models transform user empowerment on mobile hardware.\n\n` +
          `## Strategic Analysis\n` +
          `1. **Democratization of Intelligence:** Shifting inference from expensive cloud clusters to mobile silicon eliminates connectivity barriers.\n` +
          `2. **Linguistic Equity:** Preserving authentic idioms in under-served tongues like Urdu and Pashto alongside global English.\n` +
          `3. **Actionable Takeaways:** Adoption of quantized GGUF architectures allows offline generation with sub-100ms latency.\n\n` +
          `*Generated natively by Millizai AI.*`
        );
      }
      setIsGenerating(false);
    }, 1100);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-full flex flex-col bg-[#080c14] text-slate-100 overflow-y-auto custom-scrollbar p-3 space-y-3.5">
      {/* Top Bar */}
      <div className="flex items-center gap-2 pb-1 border-b border-slate-800">
        <button onClick={onBack} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h2 className="text-xs font-bold text-white">AI Writing Assistant</h2>
          <p className="text-[10px] text-emerald-400">Multilingual Composition (Urdu, English, Pashto)</p>
        </div>
      </div>

      {/* Topic Input */}
      <div>
        <label className="text-[11px] font-bold text-slate-300">Writing Prompt / Topic</label>
        <textarea
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          rows={2}
          className="w-full mt-1 bg-[#12192c] border border-slate-700 focus:border-emerald-500 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 resize-none outline-none"
          placeholder="What would you like Millizai AI to write?"
        />
      </div>

      {/* Language Selector */}
      <div>
        <label className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
          <Globe className="w-3 h-3 text-cyan-400" /> Language:
        </label>
        <div className="grid grid-cols-3 gap-2 mt-1">
          {(['English', 'Urdu', 'Pashto'] as const).map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={`py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                language === lang
                  ? 'bg-emerald-600 border-emerald-400 text-white'
                  : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}
            >
              {lang === 'Urdu' ? 'اردو' : lang === 'Pashto' ? 'پښتو' : 'English'}
            </button>
          ))}
        </div>
      </div>

      {/* Formats Selector */}
      <div>
        <label className="text-[11px] font-bold text-slate-400">Document Format:</label>
        <div className="flex gap-1.5 overflow-x-auto py-1 custom-scrollbar">
          {formats.map((fmt) => (
            <button
              key={fmt}
              onClick={() => setFormat(fmt)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold shrink-0 border ${
                format === fmt
                  ? 'bg-purple-600 border-purple-400 text-white'
                  : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}
            >
              {fmt}
            </button>
          ))}
        </div>
      </div>

      {/* Tone Selector */}
      <div>
        <label className="text-[11px] font-bold text-slate-400">Tone:</label>
        <div className="flex gap-1.5 overflow-x-auto py-1 custom-scrollbar">
          {tones.map((t) => (
            <button
              key={t}
              onClick={() => setTone(t)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold shrink-0 border ${
                tone === t
                  ? 'bg-cyan-600 border-cyan-400 text-white'
                  : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Compose Button */}
      <button
        onClick={handleGenerate}
        disabled={isGenerating || !topic.trim()}
        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-40 text-white text-xs font-bold shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all"
      >
        <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
        {isGenerating ? 'Synthesizing Draft...' : 'Compose with Millizai AI'}
      </button>

      {/* Output Viewer */}
      {output && (
        <div className="p-3 rounded-2xl bg-[#12192c] border border-slate-800 relative">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-[10px] font-bold text-emerald-400 uppercase">Generated Output</span>
            <button
              onClick={handleCopy}
              className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] flex items-center gap-1"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <div
            className={`mt-2 text-xs leading-relaxed text-slate-200 whitespace-pre-wrap ${
              language === 'Urdu' || language === 'Pashto' ? 'font-serif text-sm' : ''
            }`}
            dir={language === 'Urdu' || language === 'Pashto' ? 'rtl' : 'ltr'}
          >
            {output}
          </div>
        </div>
      )}
    </div>
  );
};
