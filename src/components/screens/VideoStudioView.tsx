import React, { useState } from 'react';
import { AppSettings, GeneratedVideo, VideoGenerationConfig } from '../../types';
import { synthesizeRealVideo, generateAiStory, GeneratedStory } from '../../services/videoService';
import {
  ArrowLeft,
  Video,
  Film,
  Sparkles,
  Camera,
  Upload,
  Play,
  Download,
  Share2,
  Clock,
  Layers,
  Wand2,
  FileVideo,
  AlertCircle,
  CheckCircle,
  Trash2,
  Globe,
  Sliders,
  ChevronRight
} from 'lucide-react';

interface Props {
  settings: AppSettings;
  onBack: () => void;
}

const VIDEO_DURATIONS: Array<5 | 10 | 15 | 20 | 25 | 30> = [5, 10, 15, 20, 25, 30];

const VIDEO_STYLES = [
  { id: 'cinematic', label: 'Cinematic', desc: 'Dramatic lighting & 4K film anamorphic flare' },
  { id: 'realistic', label: 'Realistic', desc: 'True-to-life physical textures & natural light' },
  { id: 'anime', label: 'Anime', desc: 'Vibrant Japanese animation & expressive motion' },
  { id: 'fantasy', label: 'Fantasy', desc: 'Ethereal glows, magical particles & mystical realms' },
  { id: 'horror', label: 'Horror', desc: 'Dark shadows, uncanny lighting & eerie suspense' },
  { id: 'comedy', label: 'Comedy', desc: 'Exaggerated motion, cheerful hues & playful pacing' },
  { id: 'cartoon', label: 'Cartoon', desc: 'Bright colors, 2D illustrative outlines & fun flow' }
] as const;

export const VideoStudioView: React.FC<Props> = ({ settings, onBack }) => {
  const [activeTab, setActiveTab] = useState<'text' | 'image' | 'story'>('text');

  // Text-to-Video State
  const [prompt, setPrompt] = useState('A majestic futuristic train speeding across a glowing desert under dual moons, cinematic lighting');
  const [duration, setDuration] = useState<5 | 10 | 15 | 20 | 25 | 30>(10);
  const [selectedStyle, setSelectedStyle] = useState<'cinematic' | 'realistic' | 'anime' | 'fantasy' | 'horror' | 'comedy' | 'cartoon'>('cinematic');
  const [cameraMovement, setCameraMovement] = useState<'pan_left' | 'pan_right' | 'zoom_in' | 'zoom_out' | 'static'>('zoom_in');
  const [language, setLanguage] = useState<'en' | 'ur'>('en');
  const [hasSubtitles, setHasSubtitles] = useState(true);
  const [hasNarration, setHasNarration] = useState(true);

  // Image-to-Video State
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>('https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=80');
  const [imageMotionPrompt, setImageMotionPrompt] = useState('Gentle atmospheric dust motes drifting, cinematic slow zoom, dramatic sunset bloom');

  // Story Creator State
  const [storyTopic, setStoryTopic] = useState('An explorer seeking the lost digital city in the mountains');
  const [generatedStory, setGeneratedStory] = useState<GeneratedStory | null>(null);

  // Generation status
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Saved Videos Gallery
  const [savedVideos, setSavedVideos] = useState<GeneratedVideo[]>([
    {
      id: 'demo-video-1',
      title: 'Neon Cyberpunk Dawn',
      prompt: 'Cyberpunk flying vehicle navigating holographic skyscrapers at twilight',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      durationSeconds: 15,
      style: 'Cinematic',
      mode: 'text_to_video',
      createdAt: Date.now() - 3600000,
      hasAudio: true,
      language: 'en'
    }
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleGenerateTextToVideo = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setGenerationProgress(5);
    setStatusMessage('Initializing online video inference pipeline...');

    try {
      const config: VideoGenerationConfig = {
        prompt,
        duration,
        style: selectedStyle,
        cameraMovement,
        language,
        hasNarration,
        hasSubtitles
      };

      const videoUrl = await synthesizeRealVideo(config, (pct, status) => {
        setGenerationProgress(pct);
        setStatusMessage(status);
      });

      setActiveVideoUrl(videoUrl);
      const newVideo: GeneratedVideo = {
        id: `vid-${Date.now()}`,
        title: prompt.slice(0, 32),
        prompt,
        videoUrl,
        durationSeconds: duration,
        style: selectedStyle,
        mode: 'text_to_video',
        createdAt: Date.now(),
        hasAudio: hasNarration,
        language
      };
      setSavedVideos((prev) => [newVideo, ...prev]);
      showToast('Video synthesized & ready to download!');
    } catch (e) {
      console.error(e);
      showToast('Error during video rendering. Please retry.');
    } finally {
      setIsGenerating(false);
      setGenerationProgress(0);
    }
  };

  const handleGenerateImageToVideo = async () => {
    if (!uploadedImageUrl) return;
    setIsGenerating(true);
    setGenerationProgress(10);
    setStatusMessage('Analyzing keyframe anchors & depth maps...');

    try {
      const config: VideoGenerationConfig = {
        prompt: imageMotionPrompt,
        imageUrl: uploadedImageUrl,
        duration,
        style: selectedStyle,
        cameraMovement,
        language,
        hasNarration: false,
        hasSubtitles
      };

      const videoUrl = await synthesizeRealVideo(config, (pct, status) => {
        setGenerationProgress(pct);
        setStatusMessage(status);
      });

      setActiveVideoUrl(videoUrl);
      const newVideo: GeneratedVideo = {
        id: `img-vid-${Date.now()}`,
        title: 'Animated Image Motion',
        prompt: imageMotionPrompt,
        videoUrl,
        durationSeconds: duration,
        style: selectedStyle,
        mode: 'image_to_video',
        createdAt: Date.now(),
        hasAudio: false,
        language
      };
      setSavedVideos((prev) => [newVideo, ...prev]);
      showToast('Image successfully animated into video!');
    } catch (e) {
      console.error(e);
      showToast('Failed to animate image.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCreateStory = () => {
    const story = generateAiStory(storyTopic, selectedStyle, 'Zayd');
    setGeneratedStory(story);
    showToast('AI Story & multi-scene video sequence created!');
  };

  const handleRenderFullStory = async () => {
    if (!generatedStory) return;
    setIsGenerating(true);
    setGenerationProgress(15);
    setStatusMessage('Compiling 4-scene narrative sequence...');

    try {
      const combinedPrompt = generatedStory.scenes.map((s) => s.videoPrompt).join(' | ');
      const config: VideoGenerationConfig = {
        prompt: combinedPrompt,
        duration: 25,
        style: selectedStyle,
        cameraMovement: 'zoom_in',
        language,
        hasNarration: true,
        hasSubtitles: true
      };

      const videoUrl = await synthesizeRealVideo(config, (pct, status) => {
        setGenerationProgress(pct);
        setStatusMessage(status);
      });

      setActiveVideoUrl(videoUrl);
      const newVideo: GeneratedVideo = {
        id: `story-vid-${Date.now()}`,
        title: generatedStory.titleEn,
        prompt: generatedStory.synopsisEn,
        videoUrl,
        durationSeconds: 25,
        style: selectedStyle,
        mode: 'story_creator',
        createdAt: Date.now(),
        hasAudio: true,
        language,
        scenesCount: generatedStory.scenes.length
      };
      setSavedVideos((prev) => [newVideo, ...prev]);
      showToast('Complete Story Video rendered & ready!');
    } catch (e) {
      console.error(e);
      showToast('Error generating story video.');
    } finally {
      setIsGenerating(false);
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
        setUploadedImageUrl(url);
        showToast('Image loaded for video animation!');
      }
    };
    input.click();
  };

  const handleShareVideo = async (video: GeneratedVideo) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Millizai AI Video: ${video.title}`,
          text: video.prompt,
          url: video.videoUrl
        });
        showToast('Video link shared!');
      } catch (_) {}
    } else {
      navigator.clipboard.writeText(video.videoUrl);
      showToast('Video link copied to clipboard!');
    }
  };

  const handleDeleteVideo = (id: string) => {
    setSavedVideos((prev) => prev.filter((v) => v.id !== id));
    if (activeVideoUrl) {
      setActiveVideoUrl(null);
    }
    showToast('Video removed from library.');
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
              <h2 className="text-sm font-extrabold text-white">AI Video Studio</h2>
              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold flex items-center gap-1">
                <Video className="w-2.5 h-2.5 text-cyan-400" /> ONLINE
              </span>
            </div>
            <p className="text-[10px] text-slate-400">Text-to-Video, Image Animation & Short Stories</p>
          </div>
        </div>
      </div>

      {/* Provider & Limitation Advisory Card */}
      <div className="p-2.5 rounded-xl bg-blue-950/40 border border-blue-500/30 text-[10px] text-slate-300 flex items-start gap-2">
        <AlertCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-white block">Real Online Video Synthesis Architecture</span>
          <span>
            Generates actual multi-frame motion video files (MP4/WebM). Configurable server endpoint available in Settings. Subject to model quota & max 30s per render.
          </span>
        </div>
      </div>

      {/* Feature Tabs (Text to Video | Image to Video | AI Story Creator) */}
      <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('text')}
          className={`py-1.5 rounded-lg transition-all flex items-center justify-center gap-1 text-[11px] ${
            activeTab === 'text'
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Film className="w-3 h-3" />
          Text to Video
        </button>
        <button
          onClick={() => setActiveTab('image')}
          className={`py-1.5 rounded-lg transition-all flex items-center justify-center gap-1 text-[11px] ${
            activeTab === 'image'
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Camera className="w-3 h-3" />
          Image to Video
        </button>
        <button
          onClick={() => setActiveTab('story')}
          className={`py-1.5 rounded-lg transition-all flex items-center justify-center gap-1 text-[11px] ${
            activeTab === 'story'
              ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Wand2 className="w-3 h-3" />
          Story Creator
        </button>
      </div>

      {/* Video Preview Player (When generated or playing) */}
      {activeVideoUrl && (
        <div className="rounded-2xl overflow-hidden bg-black border border-cyan-500/50 shadow-xl space-y-2 p-2">
          <div className="relative rounded-xl overflow-hidden bg-slate-950 aspect-video flex items-center justify-center">
            <video
              src={activeVideoUrl}
              controls
              autoPlay
              loop
              playsInline
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] text-cyan-300 font-bold flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-emerald-400" /> Video Rendered (Real MP4)
            </span>
            <div className="flex items-center gap-2">
              <a
                href={activeVideoUrl}
                download={`Millizai-AI-Video-${Date.now()}.mp4`}
                className="px-2.5 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-[10px] font-bold flex items-center gap-1 shadow-sm"
              >
                <Download className="w-3 h-3" /> Save MP4
              </a>
              <button
                onClick={() => handleShareVideo({
                  id: 'current',
                  title: 'Millizai Video',
                  prompt,
                  videoUrl: activeVideoUrl,
                  durationSeconds: duration,
                  style: selectedStyle,
                  mode: activeTab === 'text' ? 'text_to_video' : activeTab === 'image' ? 'image_to_video' : 'story_creator',
                  createdAt: Date.now(),
                  hasAudio: hasNarration,
                  language
                })}
                className="p-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                title="Share video"
              >
                <Share2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Progress Bar during generation */}
      {isGenerating && (
        <div className="p-3.5 rounded-2xl bg-[#0f1728] border border-cyan-500/60 shadow-lg space-y-2 animate-pulse">
          <div className="flex items-center justify-between text-xs font-bold text-cyan-300">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 animate-spin text-cyan-400" />
              {statusMessage || 'Synthesizing Real Video...'}
            </span>
            <span>{generationProgress}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 transition-all duration-300"
              style={{ width: `${generationProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* TAB 1: TEXT TO VIDEO */}
      {activeTab === 'text' && (
        <div className="space-y-3">
          {/* Prompt Input */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <label className="text-slate-300 font-bold flex items-center gap-1">
                <Film className="w-3.5 h-3.5 text-blue-400" /> Written Video Prompt
              </label>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    language === 'en' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => setLanguage('ur')}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    language === 'ur' ? 'bg-emerald-600 text-white font-urdu' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  اردو
                </button>
              </div>
            </div>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={3}
              placeholder={language === 'ur' ? 'ویڈیو کا منظر تفصیل سے بیان کریں...' : 'Describe the motion, scene, characters, and lighting...'}
              className="w-full bg-[#0d1424] border border-slate-700/80 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Quick Prompts */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 custom-scrollbar text-[10px]">
            <span className="text-slate-400 shrink-0">Inspiration:</span>
            {[
              'Cyberpunk city in heavy rain',
              'Anime hero warrior drawn at sunset',
              'Ancient Mughal fortress cinematic dawn',
              'Deep space nebula warp drive'
            ].map((p, idx) => (
              <button
                key={idx}
                onClick={() => setPrompt(p)}
                className="px-2 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 shrink-0 border border-slate-700"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Duration Selector (5, 10, 15, 20, 25, 30 seconds) */}
          <div className="space-y-1">
            <label className="text-slate-300 font-bold text-xs flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              Duration: <span className="text-cyan-400">{duration} Seconds</span>
            </label>
            <div className="grid grid-cols-6 gap-1">
              {VIDEO_DURATIONS.map((d) => (
                <button
                  key={d}
                  onClick={() => setDuration(d)}
                  className={`py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                    duration === d
                      ? 'bg-cyan-500 border-cyan-300 text-black shadow-md'
                      : 'bg-[#101728] border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {d}s
                </button>
              ))}
            </div>
          </div>

          {/* Style Selector */}
          <div className="space-y-1">
            <label className="text-slate-300 font-bold text-xs flex items-center gap-1">
              <Sliders className="w-3.5 h-3.5 text-purple-400" />
              Visual Style ({VIDEO_STYLES.length})
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {VIDEO_STYLES.map((st) => (
                <button
                  key={st.id}
                  onClick={() => setSelectedStyle(st.id)}
                  className={`p-2 rounded-xl text-left border transition-all ${
                    selectedStyle === st.id
                      ? 'bg-purple-950/70 border-purple-400 text-white shadow-sm'
                      : 'bg-[#0f1728] border-slate-800/80 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="text-xs font-bold block">{st.label}</span>
                  <span className="text-[9px] text-slate-400 line-clamp-1">{st.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Camera Motion & Narration Controls */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="space-y-1">
              <label className="text-slate-400 text-[10px] font-bold uppercase">Camera Motion</label>
              <select
                value={cameraMovement}
                onChange={(e) => setCameraMovement(e.target.value as any)}
                className="w-full bg-[#0d1424] border border-slate-700 rounded-lg p-2 text-xs text-white"
              >
                <option value="zoom_in">Slow Zoom In</option>
                <option value="zoom_out">Slow Zoom Out</option>
                <option value="pan_left">Pan Left</option>
                <option value="pan_right">Pan Right</option>
                <option value="static">Static Shot</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 text-[10px] font-bold uppercase">Subtitles & Speech</label>
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => setHasSubtitles(!hasSubtitles)}
                  className={`px-2.5 py-1 rounded-md text-[10px] font-bold border ${
                    hasSubtitles ? 'bg-cyan-900 border-cyan-500 text-cyan-200' : 'bg-slate-800 text-slate-500 border-slate-700'
                  }`}
                >
                  Subtitles {hasSubtitles ? 'ON' : 'OFF'}
                </button>
                <button
                  onClick={() => setHasNarration(!hasNarration)}
                  className={`px-2.5 py-1 rounded-md text-[10px] font-bold border ${
                    hasNarration ? 'bg-purple-900 border-purple-500 text-purple-200' : 'bg-slate-800 text-slate-500 border-slate-700'
                  }`}
                >
                  Audio {hasNarration ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerateTextToVideo}
            disabled={isGenerating || !prompt.trim()}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-extrabold text-xs shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Video ({duration}s {selectedStyle.toUpperCase()})</span>
          </button>
        </div>
      )}

      {/* TAB 2: IMAGE TO VIDEO */}
      {activeTab === 'image' && (
        <div className="space-y-3">
          {/* Uploaded Image Preview & Picker */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label className="text-slate-300 font-bold flex items-center gap-1">
                <Camera className="w-3.5 h-3.5 text-pink-400" /> Keyframe Image to Animate
              </label>
              <button
                onClick={handleUploadImageFile}
                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[10px] font-bold flex items-center gap-1"
              >
                <Upload className="w-2.5 h-2.5" /> Upload from Device
              </button>
            </div>

            <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 aspect-video flex items-center justify-center group">
              <img
                src={uploadedImageUrl}
                alt="Upload preview"
                className="w-full h-full object-cover"
              />
              <button
                onClick={handleUploadImageFile}
                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-xs font-bold gap-1"
              >
                <Upload className="w-5 h-5 text-cyan-400" />
                <span>Replace Image</span>
              </button>
            </div>
          </div>

          {/* Sample Preset Images */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Or Choose Preset:</span>
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { label: 'Anime Hero', url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=300' },
                { label: 'Cyber City', url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300' },
                { label: 'Warrior', url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=300' },
                { label: 'Landscape', url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=300' }
              ].map((p, i) => (
                <button
                  key={i}
                  onClick={() => setUploadedImageUrl(p.url)}
                  className="rounded-lg overflow-hidden border border-slate-800 hover:border-cyan-400 relative h-12"
                >
                  <img src={p.url} alt={p.label} className="w-full h-full object-cover" />
                  <span className="absolute inset-x-0 bottom-0 bg-black/70 text-[9px] text-center font-bold text-slate-200 truncate">
                    {p.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Motion Prompt */}
          <div className="space-y-1">
            <label className="text-slate-300 font-bold text-xs flex items-center gap-1">
              <Film className="w-3.5 h-3.5 text-pink-400" /> Motion Prompt & Action
            </label>
            <input
              type="text"
              value={imageMotionPrompt}
              onChange={(e) => setImageMotionPrompt(e.target.value)}
              placeholder="e.g. Gentle hair floating, camera drifting slowly, lighting blooms..."
              className="w-full bg-[#0d1424] border border-slate-700/80 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-pink-400"
            />
          </div>

          {/* Duration & Motion Type */}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Duration</label>
              <select
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value) as any)}
                className="w-full bg-[#0d1424] border border-slate-700 rounded-lg p-2 text-xs text-white"
              >
                {VIDEO_DURATIONS.map((d) => (
                  <option key={d} value={d}>{d} Seconds</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Camera Dynamics</label>
              <select
                value={cameraMovement}
                onChange={(e) => setCameraMovement(e.target.value as any)}
                className="w-full bg-[#0d1424] border border-slate-700 rounded-lg p-2 text-xs text-white"
              >
                <option value="zoom_in">Slow Zoom In</option>
                <option value="zoom_out">Slow Zoom Out</option>
                <option value="pan_left">Pan Left</option>
                <option value="pan_right">Pan Right</option>
              </select>
            </div>
          </div>

          {/* Animate Button */}
          <button
            onClick={handleGenerateImageToVideo}
            disabled={isGenerating}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-rose-500 hover:from-purple-500 hover:to-pink-500 text-white font-extrabold text-xs shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Camera className="w-4 h-4" />
            <span>Animate Image into {duration}s Video</span>
          </button>
        </div>
      )}

      {/* TAB 3: AI STORY CREATOR */}
      {activeTab === 'story' && (
        <div className="space-y-3">
          {/* Story Topic */}
          <div className="space-y-1">
            <label className="text-slate-300 font-bold text-xs flex items-center gap-1">
              <Wand2 className="w-3.5 h-3.5 text-amber-400" /> Story Concept / Topic
            </label>
            <div className="flex gap-1.5">
              <input
                type="text"
                value={storyTopic}
                onChange={(e) => setStoryTopic(e.target.value)}
                placeholder="e.g. A cyber detective uncovering ancient secrets..."
                className="flex-1 bg-[#0d1424] border border-slate-700/80 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
              />
              <button
                onClick={handleCreateStory}
                className="px-3.5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-black font-extrabold text-xs shrink-0 flex items-center gap-1 shadow-md"
              >
                <Wand2 className="w-3.5 h-3.5" /> Plan Story
              </button>
            </div>
          </div>

          {/* Generated Multi-Scene Storyboard */}
          {generatedStory && (
            <div className="space-y-2.5 p-3 rounded-2xl bg-[#0f1629] border border-amber-500/40">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div>
                  <h4 className="text-xs font-bold text-white">{generatedStory.titleEn}</h4>
                  <span className="text-[10px] text-amber-400 font-urdu">{generatedStory.titleUr}</span>
                </div>
                <span className="text-[9px] px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 font-bold">
                  {generatedStory.scenes.length} SCENES
                </span>
              </div>

              {/* Character Profile */}
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-[10px] text-slate-300">
                <span className="font-bold text-cyan-300 block">Character Consistency:</span>
                {generatedStory.characterProfile}
              </div>

              {/* Scene Breakdown */}
              <div className="space-y-1.5 max-h-48 overflow-y-auto custom-scrollbar">
                {generatedStory.scenes.map((scene) => (
                  <div key={scene.sceneNumber} className="p-2 rounded-lg bg-[#131d33] border border-slate-800 text-[10px] space-y-0.5">
                    <div className="flex items-center justify-between text-cyan-400 font-bold">
                      <span>Scene {scene.sceneNumber}: {scene.title}</span>
                      <span>{scene.durationSeconds}s</span>
                    </div>
                    <p className="text-slate-300 italic">"{scene.narrationEn}"</p>
                    <p className="text-emerald-400 font-urdu text-[11px] text-right" dir="rtl">{scene.narrationUr}</p>
                  </div>
                ))}
              </div>

              {/* Render Full Story Button */}
              <button
                onClick={handleRenderFullStory}
                disabled={isGenerating}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-400 hover:to-orange-400 text-black font-extrabold text-xs shadow-lg flex items-center justify-center gap-1.5"
              >
                <Film className="w-4 h-4" />
                <span>Render & Combine 4-Scene Story (25s MP4)</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Saved Videos Library */}
      <div className="pt-2 border-t border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-300">
          <span className="flex items-center gap-1.5">
            <FileVideo className="w-3.5 h-3.5 text-cyan-400" />
            Rendered Videos Gallery ({savedVideos.length})
          </span>
        </div>

        <div className="space-y-2">
          {savedVideos.map((vid) => (
            <div
              key={vid.id}
              className="p-2.5 rounded-xl bg-[#0c1220] border border-slate-800 hover:border-slate-700 flex items-center justify-between gap-2"
            >
              <div className="flex items-center gap-2.5 overflow-hidden">
                <button
                  onClick={() => setActiveVideoUrl(vid.videoUrl)}
                  className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center text-cyan-400 shrink-0 hover:scale-105 transition-transform"
                  title="Play video"
                >
                  <Play className="w-4 h-4 fill-current" />
                </button>
                <div className="overflow-hidden">
                  <span className="text-xs font-bold text-white block truncate">{vid.title}</span>
                  <div className="flex items-center gap-1.5 text-[9px] text-slate-400 mt-0.5">
                    <span className="text-cyan-400 font-bold">{vid.durationSeconds}s</span>
                    <span>•</span>
                    <span className="capitalize">{vid.style}</span>
                    <span>•</span>
                    <span>{new Date(vid.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <a
                  href={vid.videoUrl}
                  download={`${vid.title.replace(/\s+/g, '-')}.mp4`}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300"
                  title="Download MP4"
                >
                  <Download className="w-3.5 h-3.5" />
                </a>
                <button
                  onClick={() => handleShareVideo(vid)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                  title="Share"
                >
                  <Share2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDeleteVideo(vid.id)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-950 text-slate-400 hover:text-red-400"
                  title="Delete"
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
