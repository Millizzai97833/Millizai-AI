export type ScreenId =
  | 'splash'
  | 'home'
  | 'chat'
  | 'image'
  | 'video-studio'
  | 'writing'
  | 'coding'
  | 'voice-general'
  | 'palmistry-voice'
  | 'mental-comedy'
  | 'mature-18'
  | 'voice-recordings'
  | 'models'
  | 'downloads'
  | 'history'
  | 'settings'
  | 'about';

export type VoiceMode = 'general' | 'palmistry' | 'mental_comedy' | 'mature_18';

export type ComedyLevel = 1 | 2 | 3 | 4;

export interface VoicePersona {
  id: string;
  name: string;
  gender: 'female' | 'male';
  accent: string;
  langCode: string;
  pitch: number;
  speed: number;
  description: string;
  avatarColor: string;
  isNeural?: boolean;
  samplePhrase?: string;
}

export interface VoiceRecording {
  id: string;
  title: string;
  mode: VoiceMode;
  durationSeconds: number;
  transcript: string;
  audioBlobUrl?: string;
  createdAt: number;
  language: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  tokensGenerated?: number;
  isError?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  mode: 'online' | 'offline';
  modelName: string;
  updatedAt: number;
  messages: ChatMessage[];
}

export interface GgufModel {
  id: string;
  name: string;
  family: string;
  fileName: string;
  sizeBytes: number;
  sizeDisplay: string;
  ramRequiredMb: number;
  quantization: string;
  parameterSize: string;
  description: string;
  isDownloaded: boolean;
  isSelected: boolean;
  downloadUrl: string;
  contextLength: number;
}

export interface GeneratedImage {
  id: string;
  prompt: string;
  negativePrompt?: string;
  url: string;
  width: number;
  height: number;
  seed: number;
  steps: number;
  createdAt: number;
  mode: 'online' | 'offline';
}

export interface AppSettings {
  onlineEndpoint: string;
  onlineApiKey: string;
  onlineModel: string;
  imageEndpoint: string;
  videoEndpoint?: string;
  videoApiKey?: string;
  isOfflineMode: boolean;
  temperature: number;
  systemPrompt: string;
  selectedLanguage: 'en' | 'ur' | 'ps';
  theme: 'dark' | 'light';
  voiceSpeed: number;
  voicePitch?: number;
  voiceVolume?: number;
  voiceLanguage?: string;
  selectedVoiceId: string;
}

export interface PalmistryReport {
  id: string;
  hand: 'left' | 'right';
  imageUrl: string;
  timestamp: number;
  language: 'English' | 'Urdu' | 'Pashto';
  lifeLine: string;
  heartLine: string;
  headLine: string;
  fateLine: string;
  sunLine: string;
  personality: string;
  careerFinancial: string;
  generalReading: string;
}

export interface GeneratedVideo {
  id: string;
  title: string;
  prompt: string;
  videoUrl: string;
  thumbnailUrl?: string;
  durationSeconds: number;
  style: string;
  mode: 'text_to_video' | 'image_to_video' | 'story_creator';
  createdAt: number;
  hasAudio: boolean;
  language: 'en' | 'ur';
  scenesCount?: number;
}

export interface VideoGenerationConfig {
  prompt: string;
  negativePrompt?: string;
  imageUrl?: string;
  duration: 5 | 10 | 15 | 20 | 25 | 30;
  style: 'cinematic' | 'realistic' | 'anime' | 'fantasy' | 'horror' | 'comedy' | 'cartoon';
  motionPrompt?: string;
  cameraMovement?: 'pan_left' | 'pan_right' | 'zoom_in' | 'zoom_out' | 'static';
  language: 'en' | 'ur';
  hasNarration: boolean;
  hasSubtitles: boolean;
  scenes?: Array<{ sceneNumber: number; prompt: string; narration: string; duration: number }>;
}

