import React, { useState, useEffect } from 'react';
import { ScreenId, AppSettings, GgufModel, GeneratedImage, Conversation } from '../types';
import { SplashView } from './screens/SplashView';
import { HomeView } from './screens/HomeView';
import { ChatView } from './screens/ChatView';
import { ImageGenView } from './screens/ImageGenView';
import { WritingView } from './screens/WritingView';
import { CodingView } from './screens/CodingView';
import { ModelLibraryView } from './screens/ModelLibraryView';
import { DownloadsView } from './screens/DownloadsView';
import { HistoryView } from './screens/HistoryView';
import { SettingsView } from './screens/SettingsView';
import { AboutView } from './screens/AboutView';
import { LiveVoiceView } from './screens/LiveVoiceView';
import { PalmistryVoiceView } from './screens/PalmistryVoiceView';
import { VideoStudioView } from './screens/VideoStudioView';
import {
  Wifi,
  Signal,
  BatteryCharging,
  Circle,
  Square,
  Triangle
} from 'lucide-react';

interface Props {
  settings: AppSettings;
  onUpdateSettings: (settings: AppSettings) => void;
  models: GgufModel[];
  onUpdateModels: React.Dispatch<React.SetStateAction<GgufModel[]>>;
  gallery: GeneratedImage[];
  onAddImage: (img: GeneratedImage) => void;
  conversations: Conversation[];
  onUpdateConversations: React.Dispatch<React.SetStateAction<Conversation[]>>;
  isExpandedView?: boolean;
}

export const AndroidSimulator: React.FC<Props> = ({
  settings,
  onUpdateSettings,
  models,
  onUpdateModels,
  gallery,
  onAddImage,
  conversations,
  onUpdateConversations,
  isExpandedView = false
}) => {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('splash');
  const [currentTime, setCurrentTime] = useState('12:42');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const activeModel = models.find((m) => m.isSelected) || models[0];
  const hasDownloadedModel = models.some((m) => m.isDownloaded);

  const handleToggleOffline = () => {
    onUpdateSettings({
      ...settings,
      isOfflineMode: !settings.isOfflineMode
    });
  };

  const handleSelectModel = (id: string) => {
    onUpdateModels((prev) =>
      prev.map((m) => ({ ...m, isSelected: m.id === id }))
    );
  };

  const handleImportCustom = (custom: GgufModel) => {
    onUpdateModels((prev) => [custom, ...prev.map((m) => ({ ...m, isSelected: false }))]);
  };

  const handleDeleteModel = (id: string) => {
    onUpdateModels((prev) => {
      const filtered = prev.filter((m) => m.id !== id);
      if (filtered.length > 0 && !filtered.some((m) => m.isSelected)) {
        filtered[0].isSelected = true;
      }
      return filtered;
    });
  };

  const handleDeleteConversation = (id: string) => {
    onUpdateConversations((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className={`flex items-center justify-center ${isExpandedView ? 'w-full h-full' : ''}`}>
      {/* Outer Phone Bezel */}
      <div
        className={`${
          isExpandedView
            ? 'w-full h-full rounded-2xl'
            : 'w-[380px] h-[780px] rounded-[48px]'
        } bg-[#04060a] p-[10px] shadow-2xl shadow-purple-950/40 border-[4px] border-[#1f293d] flex flex-col relative transition-all duration-300`}
      >
        {/* Dynamic Notch Punch Hole */}
        {!isExpandedView && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-30 flex items-center justify-center gap-2 px-3 shadow-md border border-white/5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#111827] border border-white/10 flex items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-cyan-500/80" />
            </div>
            <div className="w-2 h-2 rounded-full bg-[#111827]" />
          </div>
        )}

        {/* Android Status Bar */}
        <div className="h-7 px-5 flex items-center justify-between text-[11px] text-slate-300 font-medium z-20 shrink-0 select-none bg-[#080c14]">
          <span className="font-semibold text-white tracking-wide">{currentTime}</span>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-cyan-400">5G</span>
            <Signal className="w-3 h-3 text-slate-300" />
            <Wifi className="w-3 h-3 text-slate-300" />
            <div className="flex items-center gap-0.5">
              <span className="text-[10px]">98%</span>
              <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
            </div>
          </div>
        </div>

        {/* Screen Viewport */}
        <div className="flex-1 rounded-[32px] overflow-hidden bg-[#080c14] relative flex flex-col">
          {currentScreen === 'splash' && (
            <SplashView onComplete={() => setCurrentScreen('home')} />
          )}

          {currentScreen === 'home' && (
            <HomeView
              settings={settings}
              activeModelName={activeModel?.name || 'No Model'}
              onNavigate={(s) => setCurrentScreen(s)}
              onToggleOffline={handleToggleOffline}
            />
          )}

          {currentScreen === 'chat' && (
            <ChatView
              settings={settings}
              activeModelName={activeModel?.name || 'No Model'}
              hasDownloadedModel={hasDownloadedModel}
              onBack={() => setCurrentScreen('home')}
              onNavigateToDownloads={() => setCurrentScreen('downloads')}
            />
          )}

          {currentScreen === 'image' && (
            <ImageGenView
              settings={settings}
              gallery={gallery}
              onAddImage={onAddImage}
              onBack={() => setCurrentScreen('home')}
            />
          )}

          {currentScreen === 'video-studio' && (
            <VideoStudioView
              settings={settings}
              onBack={() => setCurrentScreen('home')}
            />
          )}

          {currentScreen === 'writing' && (
            <WritingView
              settings={settings}
              onBack={() => setCurrentScreen('home')}
            />
          )}

          {currentScreen === 'coding' && (
            <CodingView
              onBack={() => setCurrentScreen('home')}
            />
          )}

          {currentScreen === 'voice-general' && (
            <LiveVoiceView
              mode="general"
              settings={settings}
              onBack={() => setCurrentScreen('home')}
            />
          )}

          {currentScreen === 'palmistry-voice' && (
            <PalmistryVoiceView
              settings={settings}
              onBack={() => setCurrentScreen('home')}
            />
          )}

          {currentScreen === 'mental-comedy' && (
            <LiveVoiceView
              mode="mental_comedy"
              settings={settings}
              onBack={() => setCurrentScreen('home')}
            />
          )}

          {currentScreen === 'mature-18' && (
            <LiveVoiceView
              mode="mature_18"
              settings={settings}
              onBack={() => setCurrentScreen('home')}
            />
          )}

          {currentScreen === 'models' && (
            <ModelLibraryView
              models={models}
              onDownload={(m) => {
                setCurrentScreen('downloads');
              }}
              onBack={() => setCurrentScreen('home')}
            />
          )}

          {currentScreen === 'downloads' && (
            <DownloadsView
              models={models}
              onSelectModel={handleSelectModel}
              onImportCustom={handleImportCustom}
              onDeleteModel={handleDeleteModel}
              onBack={() => setCurrentScreen('home')}
            />
          )}

          {currentScreen === 'history' && (
            <HistoryView
              conversations={conversations}
              onSelect={(c) => {
                setCurrentScreen('chat');
              }}
              onDelete={handleDeleteConversation}
              onBack={() => setCurrentScreen('home')}
            />
          )}

          {currentScreen === 'settings' && (
            <SettingsView
              settings={settings}
              onSave={(updated) => onUpdateSettings(updated)}
              onBack={() => setCurrentScreen('home')}
            />
          )}

          {currentScreen === 'about' && (
            <AboutView onBack={() => setCurrentScreen('home')} />
          )}
        </div>

        {/* Android Navigation Bar (Back, Home, Recents) */}
        <div className="h-8 px-12 flex items-center justify-around text-slate-500 z-20 shrink-0 select-none bg-[#080c14]">
          <button
            onClick={() => {
              if (currentScreen !== 'home' && currentScreen !== 'splash') {
                setCurrentScreen('home');
              }
            }}
            className="p-1 hover:text-white transition-colors"
            title="Back"
          >
            <Triangle className="w-3.5 h-3.5 -rotate-90 fill-current" />
          </button>
          <button
            onClick={() => setCurrentScreen('home')}
            className="p-1 hover:text-white transition-colors"
            title="Home"
          >
            <Circle className="w-3.5 h-3.5 fill-current" />
          </button>
          <button
            onClick={() => setCurrentScreen('history')}
            className="p-1 hover:text-white transition-colors"
            title="Recents"
          >
            <Square className="w-3 h-3 fill-current" />
          </button>
        </div>
      </div>
    </div>
  );
};
