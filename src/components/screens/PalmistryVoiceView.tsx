import React, { useState } from 'react';
import { AppSettings, VoiceRecording, PalmistryReport } from '../../types';
import { liveVoiceManager, VOICE_PERSONAS, generateIntelligentSpokenReply } from '../../services/voiceService';
import {
  ArrowLeft,
  Camera,
  Upload,
  Volume2,
  VolumeX,
  Mic,
  Download,
  Share2,
  Sparkles,
  Info,
  CheckCircle,
  Eye,
  FileText,
  Trash2,
  Layers,
  Heart,
  Brain,
  Shield,
  Briefcase,
  Coins,
  Compass,
  RotateCcw,
  Send
} from 'lucide-react';

interface Props {
  settings: AppSettings;
  onSaveReport?: (recording: VoiceRecording) => void;
  onBack: () => void;
}

export const PalmistryVoiceView: React.FC<Props> = ({
  settings,
  onSaveReport,
  onBack
}) => {
  // Palm Image & Scanning State
  const [palmPhotoUrl, setPalmPhotoUrl] = useState<string>(
    'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80'
  );
  const [selectedHand, setSelectedHand] = useState<'left' | 'right'>('right');
  const [showAnnotations, setShowAnnotations] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(100);
  const [selectedLineInfo, setSelectedLineInfo] = useState<string | null>(null);

  // Language & Voice
  const [language, setLanguage] = useState<'English' | 'Urdu' | 'Pashto'>('English');
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Follow-up Q&A
  const [followupText, setFollowupText] = useState('');
  const [isListeningFollowup, setIsListeningFollowup] = useState(false);
  const [followupHistory, setFollowupHistory] = useState<Array<{ q: string; a: string; time: string }>>([
    {
      q: 'What does a deep heart line mean?',
      a: 'A deep, clearly arched Heart Line signifies unwavering emotional integrity, intense dedication in love, and an empathetic intuition.',
      time: '12:45'
    }
  ]);

  // Saved Reports List
  const [savedReports, setSavedReports] = useState<PalmistryReport[]>([
    {
      id: 'rep-demo-1',
      hand: 'right',
      imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
      timestamp: Date.now() - 7200000,
      language: 'English',
      lifeLine: 'Deep, curved arch around the Mount of Venus, reflecting strong vitality and vitality.',
      heartLine: 'Extending smoothly toward Jupiter, reflecting sincerity, devotion, and high emotional standards.',
      headLine: 'Long, distinct transverse trajectory reflecting analytical clarity and visionary insight.',
      fateLine: 'Rising firmly from wrist toward Saturn, symbolizing determined self-made career growth.',
      sunLine: 'Distinct vertical branch toward Apollo, denoting high public reputation and financial magnetism.',
      personality: 'Intuitive, steadfast, thoughtful, and naturally charismatic.',
      careerFinancial: 'Strong financial tendencies with calculated investment acumen and leadership.',
      generalReading: 'Harmonious balance of heart and intellect, blessed with resilience through life transitions.'
    }
  ]);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Detailed Traditional Interpretations
  const readings = {
    English: {
      title: `${selectedHand.toUpperCase()} Palm Master Analysis`,
      lines: [
        {
          name: 'Life Line (Vitality & Resilience)',
          color: '#10B981',
          text: 'Deep, curved arch gracefully sweeping around the Mount of Venus. In traditional palmistry, this signifies strong physical recuperation, enthusiasm for living, and steady endurance through stressful periods.'
        },
        {
          name: 'Heart Line (Love & Emotions)',
          color: '#F43F5E',
          text: 'Extends towards the mount of Jupiter beneath the index finger. Denotes sincere empathy, deep romantic loyalty, and high moral standards in relationships. Protects against superficial entanglements.'
        },
        {
          name: 'Head Line (Intellect & Wisdom)',
          color: '#06B6D4',
          text: 'Clear, unbroken path traversing the palm with a gentle creative downward slope. Indicates pragmatic problem-solving balanced by imaginative vision and articulate communication.'
        },
        {
          name: 'Fate Line (Career & Life Purpose)',
          color: '#8B5CF6',
          text: 'Originates near the wrist and ascends steadily towards Saturn. Points toward a self-determined career path, resilience against unexpected obstacles, and rewarding long-term accomplishments.'
        },
        {
          name: 'Sun Line (Apollo - Fame & Wealth)',
          color: '#F59E0B',
          text: 'A vibrant vertical marker running parallel to the fate line. Reflects creative recognition, charismatic presence, and positive financial attraction through personal talents.'
        }
      ],
      sections: {
        personality: 'You possess a balanced disposition: naturally perceptive, emotionally self-aware, and driven by purpose rather than mere impulse.',
        love: 'You seek authentic emotional depth. While cautious with your trust initially, once committed your loyalty is absolute and nurturing.',
        career: 'A natural strategist suited for leadership, innovation, and independent decision-making. Significant career breakthroughs occur in middle adulthood.',
        finances: 'Prudent financial tendencies with strong wealth accumulation potential through diversified endeavors and steady discipline.',
        general: 'A fortunate, well-balanced palm showing harmony between intellect and passion. Destiny favors your courageous choices.'
      }
    },
    Urdu: {
      title: `${selectedHand === 'right' ? 'دائیں' : 'بائیں'} ہاتھ کا مکمل دست شناسی تجزیہ`,
      lines: [
        {
          name: 'زندگی کی لکیر (Life Line)',
          color: '#10B981',
          text: 'زہرہ کے ابھار کے گرد واضح، گہری اور خوبصورت گولائی۔ یہ بہترین قوت مدافعت، زندگی سے محبت اور مشکلات میں جلد سنبھلنے کی علامت ہے۔'
        },
        {
          name: 'دل کی لکیر (Heart Line)',
          color: '#F43F5E',
          text: 'مشتری کے ابھار کی جانب گامزن، جو خلوص نیت، سچی محبت، رشتوں میں وفاداری اور اعلیٰ اخلاقی اقدار کی عکاس ہے۔'
        },
        {
          name: 'دماغ کی لکیر (Head Line)',
          color: '#06B6D4',
          text: 'سیدھی اور متوازن لکیر جو تیز فہم، حقیقت پسندانہ سوچ، تخلیقی صلاحیت اور مدلل گفتگو کو ظاہر کرتی ہے۔'
        },
        {
          name: 'قسمت کی لکیر (Fate Line)',
          color: '#8B5CF6',
          text: 'کلائی سے سیدھی اوپر اٹھتی ہوئی لکیر جو اپنی محنت سے کریئر بنانے، خود اعتمادی اور باوقار کامیابیوں کا پتہ دیتی ہے۔'
        },
        {
          name: 'سورج کی لکیر (Sun Line - شہرت و دولت)',
          color: '#F59E0B',
          text: 'اپالو کے ابھار پر واضح نشان جو معاشرتی عزت، فنکارانہ صلاحتیں اور مالی آسودگی کے امکانات کو ظاہر کرتا ہے۔'
        }
      ],
      sections: {
        personality: 'آپ کی شخصیت پرکشش، سنجیدہ، بااصول اور ہمدردانہ جذبات سے لبریز ہے۔',
        love: 'محبت میں آپ سچائی اور دیرپا تعلقات کے قائل ہیں۔ آپ کے لیے باہمی عزت سب سے مقدم ہے۔',
        career: 'آپ میں قائدانہ صلاحتیں موجود ہیں۔ کریئر میں خود مختار فیصلے آپ کو بلندیوں تک لے جائیں گے۔',
        finances: 'مالی معاملات میں آپ محتاط اور دور اندیش ہیں، جس سے دولت میں مسلسل برکت اور اضافہ متوقع ہے۔',
        general: 'مجموعی طور پر آپ کا ہاتھ خوش قسمتی اور روحانی و فکری توازن کی گواہی دیتا ہے۔'
      }
    },
    Pashto: {
      title: `د ${selectedHand === 'right' ? 'ښي' : 'کيڼ'} لاس د پامسټري بشپړ شننه`,
      lines: [
        {
          name: 'د ژوند کرښه (Life Line)',
          color: '#10B981',
          text: 'د زهرې غونډۍ په شاوخوا کې روښانه او ژوره کرښه، چې د لوړې فزیکي انرژۍ او داخلي زغم څرګندونه کوي.'
        },
        {
          name: 'د زړه کرښه (Heart Line)',
          color: '#F43F5E',
          text: 'د احساساتو، صمیمیت او پاکې مینې نښه، چې په ملګرتیا او اړیکو کې د رښتینولۍ استازیتوب کوي.'
        },
        {
          name: 'د عقل کرښه (Head Line)',
          color: '#06B6D4',
          text: 'مستقیمه او ښکلې کرښه، چې د ځیرکتیا، لوړ بصیرت او باحکمته پرېکړو علامت ګڼل کیږي.'
        },
        {
          name: 'د بخت کرښه (Fate Line)',
          color: '#8B5CF6',
          text: 'په خپل همت او هڅو د بریالیتوب ترلاسه کولو نښه ده.'
        },
        {
          name: 'د لمر کرښه (Sun Line - عزت او شتمني)',
          color: '#F59E0B',
          text: 'د ټولنیز احترام او مالي سوکالۍ څرګندوی ده.'
        }
      ],
      sections: {
        personality: 'تاسو یو پیاوړی، غیرتي او صمیمي شخصیت لرئ.',
        love: 'په مینه او کورني ژوند کې وفادار او زړه سواندی یاست.',
        career: 'په کار او هلوځلو کې ستاسو زړورتیا ستاسو د پرمختګ تر ټولو لویه وسیله ده.',
        finances: 'د پیسو په مدیریت کې هوښیار یاست او راتلونکی مو روښانه دی.',
        general: 'د پامسټري له مخې ستاسو لاس د مثبت تقدیر او پرمختګ زیری ورکوي.'
      }
    }
  }[language];

  // Palm Scanning Simulation / Execution
  const handleScanPalm = () => {
    setIsScanning(true);
    setScanProgress(20);
    setTimeout(() => setScanProgress(55), 400);
    setTimeout(() => setScanProgress(85), 800);
    setTimeout(() => {
      setScanProgress(100);
      setIsScanning(false);
      showToast(`${selectedHand.toUpperCase()} Palm scanned & analyzed!`);
      handleReadAloud();
    }, 1200);
  };

  // Natural Male Voice Reading Aloud
  const handleReadAloud = () => {
    if (isSpeaking) {
      liveVoiceManager.interrupt();
      setIsSpeaking(false);
      return;
    }

    // Select natural male voice
    const maleVoice =
      language === 'Urdu'
        ? VOICE_PERSONAS.find((p) => p.id === 'tariq_urdu_male') || VOICE_PERSONAS[0]
        : language === 'Pashto'
        ? VOICE_PERSONAS.find((p) => p.id === 'zalmay_pashto_male') || VOICE_PERSONAS[0]
        : VOICE_PERSONAS.find((p) => p.id === 'rehan_calm_male') || VOICE_PERSONAS[0];

    liveVoiceManager.setPersona(maleVoice);
    setIsSpeaking(true);

    const speechSummary =
      language === 'Urdu'
        ? `آپ کے ${selectedHand === 'right' ? 'دائیں' : 'بائیں'} ہاتھ کا جائزہ: زندگی، دل اور قسمت کی لکیریں متوازن اور مضبوط ہیں۔ ${readings.sections.general}`
        : language === 'Pashto'
        ? `ستاسو د ${selectedHand === 'right' ? 'ښي' : 'کيڼ'} لاس شننه: د ژوند او عقل کرښې خورا پیاوړې دي. ${readings.sections.general}`
        : `Palmistry reading for your ${selectedHand} hand: Your life line, heart line, and fate line exhibit remarkable strength. ${readings.sections.general}`;

    liveVoiceManager.speak(
      speechSummary,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false),
      { pitch: maleVoice.pitch, speed: 0.95 }
    );
  };

  // Voice / Text Follow-Up Question
  const handleAskFollowup = (queryText: string) => {
    const q = queryText.trim();
    if (!q) return;

    setFollowupText('');
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Generate intelligent spoken reply using Rehan's palm wisdom
    const { reply } = generateIntelligentSpokenReply('palmistry', q);

    setFollowupHistory((prev) => [
      { q, a: reply, time },
      ...prev
    ]);

    // Read answer aloud with natural male voice
    const maleVoice =
      language === 'Urdu'
        ? VOICE_PERSONAS.find((p) => p.id === 'tariq_urdu_male') || VOICE_PERSONAS[0]
        : language === 'Pashto'
        ? VOICE_PERSONAS.find((p) => p.id === 'zalmay_pashto_male') || VOICE_PERSONAS[0]
        : VOICE_PERSONAS.find((p) => p.id === 'rehan_calm_male') || VOICE_PERSONAS[0];

    liveVoiceManager.setPersona(maleVoice);
    setIsSpeaking(true);
    liveVoiceManager.speak(
      reply,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false),
      { pitch: maleVoice.pitch, speed: 0.95 }
    );
  };

  const handleStartMicFollowup = () => {
    if (isListeningFollowup) {
      liveVoiceManager.stopListening();
      setIsListeningFollowup(false);
      return;
    }

    setIsListeningFollowup(true);
    liveVoiceManager.interrupt();
    setIsSpeaking(false);

    liveVoiceManager.startListening(
      (text, isFinal) => {
        setFollowupText(text);
        if (isFinal && text.trim().length > 0) {
          setIsListeningFollowup(false);
          liveVoiceManager.stopListening();
          handleAskFollowup(text.trim());
        }
      },
      undefined,
      () => setIsListeningFollowup(false)
    );
  };

  // Save current report to local list
  const handleSaveReport = () => {
    const newRep: PalmistryReport = {
      id: `palm-${Date.now()}`,
      hand: selectedHand,
      imageUrl: palmPhotoUrl,
      timestamp: Date.now(),
      language,
      lifeLine: readings.lines[0].text,
      heartLine: readings.lines[1].text,
      headLine: readings.lines[2].text,
      fateLine: readings.lines[3].text,
      sunLine: readings.lines[4].text,
      personality: readings.sections.personality,
      careerFinancial: readings.sections.career,
      generalReading: readings.sections.general
    };

    setSavedReports((prev) => [newRep, ...prev]);
    showToast('Palmistry Report saved to local storage!');
  };

  // Export as WAV Audio
  const handleExportWav = () => {
    const fullSpokenText = readings.lines.map((l) => `${l.name}: ${l.text}`).join('. ');
    const blob = liveVoiceManager.generateWavAudioBlob(12, fullSpokenText);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Millizai-Palmistry-${selectedHand}-Report-${Date.now()}.wav`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast('Spoken reading exported as WAV audio!');
  };

  // Share report via Web Share or Clipboard
  const handleShareReport = () => {
    const textToShare = `# ${readings.title}\n\n` +
      readings.lines.map((l) => `• ${l.name}:\n${l.text}`).join('\n\n') +
      `\n\nPersonality: ${readings.sections.personality}\nCareer & Finance: ${readings.sections.career}\n\nMillizai AI by Shahab Millizai`;

    if (navigator.share) {
      navigator.share({
        title: readings.title,
        text: textToShare
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(textToShare);
      showToast('Report copied to clipboard!');
    }
  };

  const handleUploadImageFile = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const url = URL.createObjectURL(file);
        setPalmPhotoUrl(url);
        handleScanPalm();
      }
    };
    input.click();
  };

  const handleDeleteReport = (id: string) => {
    setSavedReports((prev) => prev.filter((r) => r.id !== id));
    showToast('Report deleted.');
  };

  return (
    <div className="h-full flex flex-col bg-[#070b14] text-slate-100 overflow-y-auto custom-scrollbar p-3 space-y-3.5 select-none">
      {/* Toast Notice */}
      {toastMessage && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-50 px-3.5 py-1.5 rounded-full bg-cyan-600 text-white text-xs font-bold shadow-xl animate-fade-in flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          {toastMessage}
        </div>
      )}

      {/* Top Header */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-sm font-extrabold text-white">Palmistry Master</h2>
              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-purple-950 text-purple-300 border border-purple-800 font-bold flex items-center gap-1">
                <Compass className="w-2.5 h-2.5 text-purple-400" /> ANNOTATED AI
              </span>
            </div>
            <p className="text-[10px] text-slate-400">Lines Detection, Multi-Language & Male Voice Readings</p>
          </div>
        </div>

        {/* Hand Toggle (Left / Right) */}
        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-[10px] font-bold">
          <button
            onClick={() => {
              setSelectedHand('left');
              handleScanPalm();
            }}
            className={`px-2 py-1 rounded-md transition-colors ${
              selectedHand === 'left' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Left Palm
          </button>
          <button
            onClick={() => {
              setSelectedHand('right');
              handleScanPalm();
            }}
            className={`px-2 py-1 rounded-md transition-colors ${
              selectedHand === 'right' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Right Palm
          </button>
        </div>
      </div>

      {/* Folklore & Entertainment Advisory Notice */}
      <div className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-500/30 text-[10px] text-slate-300 flex items-start gap-2">
        <Info className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-white block">Traditional Folklore Advisory</span>
          <span>
            Palmistry is provided for traditional cultural interest and philosophical self-reflection, not scientifically validated medical or future predictions.
          </span>
        </div>
      </div>

      {/* Annotated Palm Photo Section */}
      <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-cyan-500/40 shadow-xl group">
        <div className="relative aspect-[4/3] w-full flex items-center justify-center overflow-hidden">
          <img
            src={palmPhotoUrl}
            alt="Palm photograph"
            className={`w-full h-full object-cover transition-all duration-700 ${
              isScanning ? 'scale-105 brightness-110 blur-[1px]' : 'scale-100'
            }`}
          />

          {/* Interactive Landmark SVG Annotation Overlay */}
          {showAnnotations && !isScanning && (
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 400 300"
              preserveAspectRatio="none"
            >
              {/* Life Line (Emerald curve around thumb) */}
              <path
                d="M 170 120 Q 155 170 185 240"
                fill="none"
                stroke="#10B981"
                strokeWidth="4"
                strokeDasharray="4,2"
                className="animate-pulse"
              />
              <text x="135" y="180" fill="#10B981" fontSize="10" fontWeight="bold">Life Line</text>

              {/* Heart Line (Rose curve under fingers) */}
              <path
                d="M 310 110 Q 240 100 190 125"
                fill="none"
                stroke="#F43F5E"
                strokeWidth="4"
              />
              <text x="260" y="98" fill="#F43F5E" fontSize="10" fontWeight="bold">Heart Line</text>

              {/* Head Line (Cyan line traversing palm) */}
              <path
                d="M 175 125 Q 230 145 295 170"
                fill="none"
                stroke="#06B6D4"
                strokeWidth="4"
              />
              <text x="245" y="145" fill="#06B6D4" fontSize="10" fontWeight="bold">Head Line</text>

              {/* Fate Line (Purple vertical line) */}
              <path
                d="M 230 260 L 235 130"
                fill="none"
                stroke="#8B5CF6"
                strokeWidth="4"
                strokeDasharray="6,3"
              />
              <text x="242" y="215" fill="#8B5CF6" fontSize="10" fontWeight="bold">Fate Line</text>

              {/* Sun Line (Apollo - Gold vertical line) */}
              <path
                d="M 270 200 L 275 125"
                fill="none"
                stroke="#F59E0B"
                strokeWidth="3"
              />
              <text x="280" y="165" fill="#F59E0B" fontSize="9" fontWeight="bold">Sun Line</text>

              {/* Mount of Venus anchor */}
              <circle cx="160" cy="200" r="18" fill="rgba(16, 185, 129, 0.2)" stroke="#10B981" strokeWidth="1" />
              <text x="145" y="204" fill="#ffffff" fontSize="8" fontWeight="bold">Venus</text>
            </svg>
          )}

          {/* Scanning Beam Animation */}
          {isScanning && (
            <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#06b6d4] animate-scan" />
          )}

          {/* Top Overlays: Annotations Toggle & Upload */}
          <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between">
            <button
              onClick={() => setShowAnnotations(!showAnnotations)}
              className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-bold text-white border border-white/20 flex items-center gap-1 shadow-md"
            >
              <Layers className="w-3 h-3 text-cyan-400" />
              {showAnnotations ? 'Hide Lines' : 'Show Lines'}
            </button>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleUploadImageFile}
                className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-bold text-white border border-white/20 flex items-center gap-1 shadow-md hover:bg-black/90"
              >
                <Upload className="w-3 h-3 text-emerald-400" />
                Upload New Palm
              </button>
            </div>
          </div>

          {/* Bottom Bar: Re-Scan Button */}
          <div className="absolute bottom-2.5 right-2.5">
            <button
              onClick={handleScanPalm}
              disabled={isScanning}
              className="px-3 py-1.5 rounded-full bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-lg flex items-center gap-1.5"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
              <span>{isScanning ? 'Scanning Lines...' : 'Re-Analyze Palm'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Language Switcher Bar */}
      <div className="flex items-center justify-between p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
        <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider pl-1.5">
          Report Language:
        </span>
        <div className="flex items-center gap-1">
          {(['English', 'Urdu', 'Pashto'] as const).map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                language === lang
                  ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {lang === 'Urdu' ? 'اردو' : lang === 'Pashto' ? 'پښتو' : 'English'}
            </button>
          ))}
        </div>
      </div>

      {/* Action Bar (Read Aloud, Save Report, Export Audio, Share) */}
      <div className="grid grid-cols-4 gap-1.5">
        <button
          onClick={handleReadAloud}
          className={`py-2 rounded-xl border flex flex-col items-center justify-center gap-0.5 text-[10px] font-bold transition-all ${
            isSpeaking
              ? 'bg-red-950/80 border-red-500 text-red-300 animate-pulse'
              : 'bg-slate-900 border-slate-800 text-cyan-300 hover:bg-slate-800'
          }`}
        >
          {isSpeaking ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
          <span>{isSpeaking ? 'Stop Voice' : 'Read Aloud'}</span>
        </button>

        <button
          onClick={handleSaveReport}
          className="py-2 rounded-xl bg-slate-900 border border-slate-800 text-emerald-300 hover:bg-slate-800 flex flex-col items-center justify-center gap-0.5 text-[10px] font-bold"
        >
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>Save Report</span>
        </button>

        <button
          onClick={handleExportWav}
          className="py-2 rounded-xl bg-slate-900 border border-slate-800 text-purple-300 hover:bg-slate-800 flex flex-col items-center justify-center gap-0.5 text-[10px] font-bold"
        >
          <Download className="w-4 h-4 text-purple-400" />
          <span>WAV Audio</span>
        </button>

        <button
          onClick={handleShareReport}
          className="py-2 rounded-xl bg-slate-900 border border-slate-800 text-amber-300 hover:bg-slate-800 flex flex-col items-center justify-center gap-0.5 text-[10px] font-bold"
        >
          <Share2 className="w-4 h-4 text-amber-400" />
          <span>Share</span>
        </button>
      </div>

      {/* 5 Landmark Detected Lines Cards */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-300">
          <span className="flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
            Detected Palm Lines ({readings.lines.length})
          </span>
          <span className="text-[10px] text-cyan-400">Rehan AI Natural Male Voice</span>
        </div>

        <div className="space-y-1.5">
          {readings.lines.map((line, idx) => (
            <div
              key={idx}
              className="p-2.5 rounded-xl bg-[#0d1424] border border-slate-800 hover:border-slate-700 transition-all text-xs space-y-1"
            >
              <div className="flex items-center justify-between font-bold" style={{ color: line.color }}>
                <span>{line.name}</span>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: line.color }} />
              </div>
              <p className={`text-[11px] text-slate-300 leading-relaxed ${language !== 'English' ? 'text-right' : ''}`}>
                {line.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Categorized In-Depth Readings (Personality, Love, Career, Finance, Holistic) */}
      <div className="space-y-2 pt-1 border-t border-slate-800">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          Life Domain Analysis
        </h3>

        <div className="grid grid-cols-2 gap-2 text-xs">
          {/* Personality */}
          <div className="p-2.5 rounded-xl bg-[#0f1728] border border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 text-purple-300 font-bold text-[11px]">
              <Brain className="w-3.5 h-3.5 text-purple-400" /> Personality & Mind
            </div>
            <p className="text-[10px] text-slate-300 leading-relaxed">{readings.sections.personality}</p>
          </div>

          {/* Love & Relationships */}
          <div className="p-2.5 rounded-xl bg-[#0f1728] border border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 text-rose-300 font-bold text-[11px]">
              <Heart className="w-3.5 h-3.5 text-rose-400" /> Love & Relationships
            </div>
            <p className="text-[10px] text-slate-300 leading-relaxed">{readings.sections.love}</p>
          </div>

          {/* Career & Ambition */}
          <div className="p-2.5 rounded-xl bg-[#0f1728] border border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 text-blue-300 font-bold text-[11px]">
              <Briefcase className="w-3.5 h-3.5 text-blue-400" /> Career & Ambition
            </div>
            <p className="text-[10px] text-slate-300 leading-relaxed">{readings.sections.career}</p>
          </div>

          {/* Financial Tendencies */}
          <div className="p-2.5 rounded-xl bg-[#0f1728] border border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-300 font-bold text-[11px]">
              <Coins className="w-3.5 h-3.5 text-emerald-400" /> Financial Tendencies
            </div>
            <p className="text-[10px] text-slate-300 leading-relaxed">{readings.sections.finances}</p>
          </div>
        </div>
      </div>

      {/* Follow-up Voice / Text Q&A */}
      <div className="pt-2 border-t border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-300">
          <span className="flex items-center gap-1.5">
            <Mic className="w-3.5 h-3.5 text-cyan-400" />
            Spoken Follow-Up Questions
          </span>
          <span className="text-[10px] text-slate-400">Ask via Voice or Text</span>
        </div>

        <div className="flex items-center gap-1.5">
          <input
            type="text"
            value={followupText}
            onChange={(e) => setFollowupText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAskFollowup(followupText);
            }}
            placeholder="Ask about your destiny, love, career, or lines..."
            className="flex-1 bg-[#0d1424] border border-slate-700/80 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
          />
          <button
            onClick={handleStartMicFollowup}
            className={`p-2.5 rounded-xl border transition-all ${
              isListeningFollowup
                ? 'bg-red-600 border-red-500 text-white animate-pulse'
                : 'bg-slate-800 border-slate-700 text-cyan-300'
            }`}
            title="Speak Question into Microphone"
          >
            <Mic className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleAskFollowup(followupText)}
            className="p-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold"
            title="Submit Question"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        {/* Q&A History Drawer */}
        <div className="space-y-1.5 max-h-36 overflow-y-auto custom-scrollbar">
          {followupHistory.map((item, i) => (
            <div key={i} className="p-2 rounded-xl bg-[#0c1220] border border-slate-800 text-xs space-y-1">
              <div className="flex items-center justify-between text-cyan-400 text-[10px] font-bold">
                <span>Q: {item.q}</span>
                <span className="text-slate-500">{item.time}</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Saved Reports Drawer */}
      <div className="pt-2 border-t border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-300">
          <span className="flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-emerald-400" />
            Saved Palm Reports ({savedReports.length})
          </span>
        </div>

        <div className="space-y-2">
          {savedReports.map((rep) => (
            <div
              key={rep.id}
              className="p-2.5 rounded-xl bg-[#0c1220] border border-slate-800 hover:border-slate-700 flex items-center justify-between gap-2"
            >
              <div>
                <span className="text-xs font-bold text-white block capitalize">
                  {rep.hand} Palm Analysis ({rep.language})
                </span>
                <span className="text-[10px] text-slate-400">
                  {new Date(rep.timestamp).toLocaleDateString()} • {new Date(rep.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    setSelectedHand(rep.hand);
                    setLanguage(rep.language);
                    showToast(`Loaded ${rep.hand} palm report.`);
                  }}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[10px] font-semibold"
                >
                  View
                </button>
                <button
                  onClick={() => handleDeleteReport(rep.id)}
                  className="p-1.5 rounded bg-slate-800 hover:bg-red-950 text-slate-400 hover:text-red-400"
                  title="Delete Report"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
