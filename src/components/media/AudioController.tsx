import React, { useState } from 'react';
import { Volume2, VolumeX, Music, Mic, Zap, Settings2 } from 'lucide-react';
import { PreferencesState } from '../../engine/state/types';

interface AudioControllerProps {
  preferences: PreferencesState;
  onUpdatePreferences: (preferences: Partial<PreferencesState>) => void;
  className?: string;
}

export const AudioController: React.FC<AudioControllerProps> = ({
  preferences,
  onUpdatePreferences,
  className = '',
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleMasterAudio = () => {
    const nextState = !preferences.audioEnabled;
    onUpdatePreferences({
      audioEnabled: nextState,
      musicEnabled: nextState,
    });
  };

  return (
    <div
      id="audio-controller-hud"
      className={`relative inline-flex items-center gap-1.5 ${className}`}
    >
      <button
        id="audio-master-toggle-btn"
        type="button"
        onClick={toggleMasterAudio}
        aria-label={preferences.audioEnabled ? 'Desactivar audio' : 'Activar audio'}
        title={preferences.audioEnabled ? 'Audio habilitado' : 'Audio silenciado'}
        className={`p-2 rounded-lg border transition-all duration-200 cursor-pointer ${
          preferences.audioEnabled
            ? 'bg-orange-500/10 border-orange-500/30 text-orange-400 shadow-[0_0_10px_rgba(234,88,12,0.2)]'
            : 'bg-[#0A0A0A] border-[#1A1A1A] text-neutral-500 hover:text-neutral-300'
        }`}
      >
        {preferences.audioEnabled ? (
          <Volume2 className="w-4 h-4" />
        ) : (
          <VolumeX className="w-4 h-4" />
        )}
      </button>

      <button
        id="audio-settings-toggle-btn"
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-label="Configuración de audio"
        title="Canales de audio"
        className="p-2 rounded-lg bg-[#0A0A0A] border border-[#1A1A1A] text-neutral-400 hover:text-white transition-colors"
      >
        <Settings2 className="w-4 h-4" />
      </button>

      {/* Expanded audio channels modal/popover */}
      {isExpanded && (
        <div
          id="audio-channels-popover"
          className="absolute right-0 top-12 z-50 w-56 p-3.5 rounded-xl bg-[#0A0A0A] border border-[#1A1A1A] shadow-2xl space-y-3 animate-fade-in"
        >
          <div className="flex items-center justify-between border-b border-[#1A1A1A] pb-2">
            <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-400">
              Canales de Audio
            </span>
            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              className="text-xs text-neutral-500 hover:text-neutral-300"
            >
              Cerrar
            </button>
          </div>

          <div className="space-y-2">
            <label className="flex items-center justify-between text-xs text-neutral-300 cursor-pointer">
              <span className="flex items-center gap-2">
                <Music className="w-3.5 h-3.5 text-orange-400" />
                Música
              </span>
              <input
                type="checkbox"
                checked={preferences.musicEnabled}
                onChange={(e) =>
                  onUpdatePreferences({
                    musicEnabled: e.target.checked,
                    audioEnabled: e.target.checked || preferences.audioEnabled,
                  })
                }
                className="rounded bg-neutral-900 border-[#1A1A1A] text-orange-500 focus:ring-orange-500"
              />
            </label>

            <label className="flex items-center justify-between text-xs text-neutral-300 cursor-pointer">
              <span className="flex items-center gap-2">
                <Mic className="w-3.5 h-3.5 text-neutral-400" />
                Voz en off
              </span>
              <input
                type="checkbox"
                checked={preferences.voiceEnabled}
                onChange={(e) => onUpdatePreferences({ voiceEnabled: e.target.checked })}
                className="rounded bg-neutral-900 border-[#1A1A1A] text-orange-500 focus:ring-orange-500"
              />
            </label>

            <label className="flex items-center justify-between text-xs text-neutral-300 cursor-pointer">
              <span className="flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-neutral-400" />
                Efectos SFX
              </span>
              <input
                type="checkbox"
                checked={preferences.sfxEnabled}
                onChange={(e) => onUpdatePreferences({ sfxEnabled: e.target.checked })}
                className="rounded bg-neutral-900 border-[#1A1A1A] text-orange-500 focus:ring-orange-500"
              />
            </label>
          </div>
        </div>
      )}
    </div>
  );
};
