import React, { useState, useEffect } from 'react';
import {
  Bug,
  ChevronDown,
  ChevronUp,
  FastForward,
  Trash2,
  ShieldAlert,
  Play,
  RotateCcw,
  Cpu,
  Database,
  Layers,
  Clock,
  Zap,
} from 'lucide-react';
import { FunnelState, ExperienceId } from '../../engine/state/types';
import { FunnelEventLogEntry } from '../../engine/events/types';
import { eventTracker } from '../../engine/events/eventTracker';
import { EXPERIENCES } from '../../experiences/registry';
import {
  loadExperienceRuntimeState,
  clearExperienceRuntimeState,
} from '../../engine/experience/experienceState';
import { evaluateCondition } from '../../engine/experience/conditionEvaluator';
import { ConditionOperator } from '../../engine/experience/types';
import { narrativePacingManager } from '../../engine/pacing/pacingManager';
import { NarrativePacingDebugState } from '../../engine/pacing/types';

interface DebugPanelProps {
  state: FunnelState;
  activeTestMode?: boolean;
  onToggleTestMode?: () => void;
  onResetSession: () => void;
  onGoToExperience: (id: ExperienceId) => void;
  onUnlockAll: () => void;
  onCorruptSession: () => void;
}

export const DebugPanel: React.FC<DebugPanelProps> = ({
  state,
  activeTestMode = false,
  onToggleTestMode,
  onResetSession,
  onGoToExperience,
  onUnlockAll,
  onCorruptSession,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'engine' | 'pacing' | 'state' | 'memory' | 'events' | 'tools'>('engine');
  const [logs, setLogs] = useState<FunnelEventLogEntry[]>([]);
  const [pacingDebug, setPacingDebug] = useState<NarrativePacingDebugState>(() =>
    narrativePacingManager.getDebugState()
  );

  // Condition Evaluator Playground state
  const [testField, setTestField] = useState('testAnswer');
  const [testOperator, setTestOperator] = useState<ConditionOperator>('==');
  const [testValue, setTestValue] = useState('A');
  const [evalResult, setEvalResult] = useState<boolean | null>(null);

  // Runtime state of current experience
  const currentExpId = activeTestMode ? 'exp_test' : state.progress.currentExperience;
  const runtimeState = loadExperienceRuntimeState(currentExpId);

  useEffect(() => {
    setLogs(eventTracker.getLogs());
    const unsubscribe = eventTracker.subscribe(() => {
      setLogs(eventTracker.getLogs());
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    setPacingDebug(narrativePacingManager.getDebugState());
    const unsubscribe = narrativePacingManager.subscribe(() => {
      setPacingDebug({ ...narrativePacingManager.getDebugState() });
    });
    return unsubscribe;
  }, []);

  const handleTestCondition = () => {
    const memory = runtimeState?.localMemory || {};
    const evalCtx = {
      runtimeState: runtimeState || {
        experienceId: currentExpId,
        currentScreen: 'entry',
        status: 'ACTIVE' as const,
        localData: {},
        localMemory: {},
        completedScreens: [],
        startedAt: '',
        lastActivityAt: '',
      },
      funnelState: state,
      memory,
      responses: (state.responses[state.progress.currentExperience as keyof typeof state.responses] || {}) as Record<string, unknown>,
      completedExperiences: state.progress.completedExperiences,
    };

    let parsedVal: unknown = testValue;
    if (testValue === 'true') parsedVal = true;
    if (testValue === 'false') parsedVal = false;
    if (!isNaN(Number(testValue)) && testValue.trim() !== '') parsedVal = Number(testValue);

    const res = evaluateCondition(
      {
        field: testField,
        operator: testOperator,
        value: parsedVal,
      },
      evalCtx
    );

    setEvalResult(res);
  };

  const handleResetCurrentRuntime = () => {
    clearExperienceRuntimeState(currentExpId);
    window.location.reload();
  };

  const handleToggleFastPacing = () => {
    narrativePacingManager.toggleFastMode();
  };

  return (
    <div id="funnel-debug-hud" className="fixed bottom-3 right-3 z-50 font-mono text-xs">
      {/* Toggle button */}
      <button
        id="debug-hud-toggle-btn"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#0A0A0A] border border-[#1A1A1A] text-orange-500 shadow-xl hover:bg-[#141414] hover:border-orange-500/40 transition-all cursor-pointer backdrop-blur-md"
      >
        <Bug className="w-3.5 h-3.5" />
        <span className="font-semibold uppercase tracking-wider text-[10px]">
          Engine HUD {activeTestMode ? '(EXP_TEST)' : ''}
        </span>
        {pacingDebug.isFastMode && (
          <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 text-[9px] font-bold">
            FAST
          </span>
        )}
        {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
      </button>

      {/* Panel */}
      {isOpen && (
        <div
          id="debug-hud-panel"
          className="absolute bottom-12 right-0 w-80 sm:w-[440px] max-h-[85vh] flex flex-col rounded-xl bg-[#0A0A0A] border border-[#1A1A1A] shadow-2xl backdrop-blur-xl text-neutral-300 overflow-hidden"
        >
          {/* Header */}
          <div className="p-2.5 border-b border-[#1A1A1A] flex items-center justify-between bg-[#080808]">
            <span className="font-bold text-orange-500 uppercase tracking-widest text-[10px] flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5" /> Contexto Engine
            </span>
            <div className="flex gap-1 overflow-x-auto">
              {(['engine', 'pacing', 'memory', 'state', 'events', 'tools'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`px-2 py-0.5 rounded text-[9px] uppercase tracking-wider ${
                    activeTab === tab
                      ? 'bg-orange-600 text-white font-bold'
                      : 'bg-[#141414] text-neutral-400 hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Body */}
          <div className="p-3 overflow-y-auto max-h-[70vh] space-y-3">
            {/* PACING TAB */}
            {activeTab === 'pacing' && (
              <div className="space-y-3">
                <div className="p-2.5 rounded-lg border border-orange-500/30 bg-orange-950/20 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-[11px] font-bold text-orange-400 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-orange-400" /> Fast Pacing Mode (Debug Only)
                    </p>
                    <p className="text-[9px] text-neutral-400">
                      {pacingDebug.isFastMode
                        ? 'Aceleración activa: tiempos reducidos para pruebas'
                        : 'Pacing normal activo: tiempos cinematográficos'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleToggleFastPacing}
                    className={`px-2.5 py-1 rounded font-bold text-[10px] uppercase transition-colors ${
                      pacingDebug.isFastMode
                        ? 'bg-amber-600 text-white'
                        : 'bg-[#0D0D0D] border border-orange-500 text-orange-400 hover:bg-orange-500/20'
                    }`}
                  >
                    {pacingDebug.isFastMode ? 'Desactivar' : 'Activar'}
                  </button>
                </div>

                <div className="p-2.5 rounded bg-[#0D0D0D] border border-[#1A1A1A] space-y-2 text-[11px]">
                  <p className="text-[10px] font-bold text-orange-400 uppercase tracking-wider flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Estado de Pacing Narrativo
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div className="p-2 rounded bg-[#080808] border border-[#181818] space-y-0.5">
                      <span className="text-neutral-500 uppercase text-[8px] block">Experiencia</span>
                      <span className="text-orange-400 font-bold">{pacingDebug.experienceId}</span>
                    </div>
                    <div className="p-2 rounded bg-[#080808] border border-[#181818] space-y-0.5">
                      <span className="text-neutral-500 uppercase text-[8px] block">Pantalla</span>
                      <span className="text-amber-400 font-mono font-bold truncate block">{pacingDebug.screenId}</span>
                    </div>
                    <div className="p-2 rounded bg-[#080808] border border-[#181818] space-y-0.5">
                      <span className="text-neutral-500 uppercase text-[8px] block">Beat / Stage</span>
                      <span className="text-emerald-400 font-bold">
                        Etapa {pacingDebug.currentStage} de {pacingDebug.totalStages}
                      </span>
                    </div>
                    <div className="p-2 rounded bg-[#080808] border border-[#181818] space-y-0.5">
                      <span className="text-neutral-500 uppercase text-[8px] block">Ritmo (PacingMode)</span>
                      <span className="text-cyan-400 font-bold">{pacingDebug.currentPacing}</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-1 text-[10px]">
                    <div className="flex items-center justify-between border-t border-[#181818] pt-1.5">
                      <span className="text-neutral-400">Pausa Narrativa Activa</span>
                      <span className={`font-bold ${pacingDebug.isPaused ? 'text-amber-400' : 'text-neutral-500'}`}>
                        {pacingDebug.isPaused ? 'SÍ (Procesamiento)' : 'NO'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-400">CTA Bloqueado</span>
                      <span className={`font-bold ${pacingDebug.isCTABlocked ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {pacingDebug.isCTABlocked ? 'SÍ (Esperando procesar)' : 'NO (Disponible)'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-400">Opciones Reveladas</span>
                      <span className={`font-bold ${pacingDebug.isOptionsAvailable ? 'text-emerald-400' : 'text-neutral-500'}`}>
                        {pacingDebug.isOptionsAvailable ? 'SÍ' : 'NO'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-400">Tiempo en Beat Actual</span>
                      <span className="text-neutral-300 font-mono">
                        {(pacingDebug.elapsedTimeMs / 1000).toFixed(1)}s
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-400">Modo Reducción Movimiento</span>
                      <span className={`font-bold ${pacingDebug.reducedMotion ? 'text-amber-400' : 'text-neutral-500'}`}>
                        {pacingDebug.reducedMotion ? 'ACTIVO' : 'INACTIVO'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ENGINE TAB */}
            {activeTab === 'engine' && (
              <div className="space-y-3">
                {/* EXP_TEST Toggle */}
                {onToggleTestMode && (
                  <div className="p-2.5 rounded-lg border border-orange-500/30 bg-orange-500/10 flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-bold text-orange-400">EXP_TEST Sandbox</p>
                      <p className="text-[9px] text-neutral-400">
                        {activeTestMode ? 'Modo de validación ACTIVO' : 'Probar flujo completo de validación'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={onToggleTestMode}
                      className={`px-2.5 py-1 rounded font-bold text-[10px] uppercase transition-colors ${
                        activeTestMode
                          ? 'bg-orange-600 text-white'
                          : 'bg-[#0A0A0A] border border-orange-500 text-orange-400 hover:bg-orange-500/20'
                      }`}
                    >
                      {activeTestMode ? 'Salir EXP_TEST' : 'Ejecutar EXP_TEST'}
                    </button>
                  </div>
                )}

                {/* Runtime State Snapshot */}
                <div className="p-2.5 rounded bg-[#0D0D0D] border border-[#1A1A1A] space-y-1.5 text-[11px]">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400 uppercase text-[9px] tracking-wider">Experience ID</span>
                    <span className="text-orange-400 font-bold">{currentExpId}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400 uppercase text-[9px] tracking-wider">Current Screen</span>
                    <span className="text-amber-400 font-mono font-bold">
                      {runtimeState?.currentScreen || 'screen_intro'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400 uppercase text-[9px] tracking-wider">Runtime Status</span>
                    <span className="inline-block px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                      {runtimeState?.status || 'ACTIVE'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400 uppercase text-[9px] tracking-wider">Completed Screens</span>
                    <span className="text-neutral-300 text-[10px]">
                      {runtimeState?.completedScreens?.join(', ') || 'ninguna'}
                    </span>
                  </div>
                </div>

                {/* Condition Evaluator Tool */}
                <div className="p-2.5 rounded bg-[#080808] border border-[#1A1A1A] space-y-2">
                  <p className="text-[10px] uppercase tracking-wider text-orange-400 font-bold flex items-center gap-1">
                    <Layers className="w-3 h-3" /> Evaluador de Condiciones
                  </p>
                  <div className="grid grid-cols-3 gap-1.5 text-[10px]">
                    <input
                      type="text"
                      value={testField}
                      onChange={(e) => setTestField(e.target.value)}
                      placeholder="Field (e.g. testAnswer)"
                      className="px-2 py-1 rounded bg-[#0D0D0D] border border-[#222] text-neutral-200"
                    />
                    <select
                      value={testOperator}
                      onChange={(e) => setTestOperator(e.target.value as ConditionOperator)}
                      className="px-2 py-1 rounded bg-[#0D0D0D] border border-[#222] text-neutral-200"
                    >
                      <option value="==">==</option>
                      <option value="!=">!=</option>
                      <option value="===">===</option>
                      <option value=">">&gt;</option>
                      <option value="<">&lt;</option>
                      <option value=">=">&gt;=</option>
                      <option value="<=">&lt;=</option>
                      <option value="exists">exists</option>
                      <option value="notExists">notExists</option>
                      <option value="includes">includes</option>
                    </select>
                    <input
                      type="text"
                      value={testValue}
                      onChange={(e) => setTestValue(e.target.value)}
                      placeholder="Value"
                      className="px-2 py-1 rounded bg-[#0D0D0D] border border-[#222] text-neutral-200"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="button"
                      onClick={handleTestCondition}
                      className="px-2 py-1 rounded bg-orange-600 hover:bg-orange-500 text-white font-bold text-[10px] flex items-center gap-1"
                    >
                      <Play className="w-2.5 h-2.5" /> Evaluar
                    </button>
                    {evalResult !== null && (
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          evalResult
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        Resultado: {evalResult ? 'TRUE' : 'FALSE'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Reset Experience State */}
                <button
                  type="button"
                  onClick={handleResetCurrentRuntime}
                  className="w-full flex items-center justify-center gap-1.5 p-2 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 text-[10px]"
                >
                  <RotateCcw className="w-3 h-3" /> Resetear Runtime de {currentExpId}
                </button>
              </div>
            )}

            {/* MEMORY TAB */}
            {activeTab === 'memory' && (
              <div className="space-y-2">
                <div className="p-2.5 rounded bg-[#0D0D0D] border border-[#1A1A1A] space-y-1">
                  <p className="text-[10px] font-bold text-orange-400 uppercase tracking-wider flex items-center gap-1">
                    <Database className="w-3 h-3" /> Memoria Local ({currentExpId})
                  </p>
                  <pre className="text-[9px] text-neutral-300 overflow-x-auto p-2 bg-[#050505] rounded border border-[#1A1A1A]">
                    {JSON.stringify(runtimeState?.localMemory || {}, null, 2)}
                  </pre>
                </div>

                <div className="p-2.5 rounded bg-[#0D0D0D] border border-[#1A1A1A] space-y-1">
                  <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                    Memoria Global (Respuestas FunnelState)
                  </p>
                  <pre className="text-[9px] text-neutral-300 overflow-x-auto p-2 bg-[#050505] rounded border border-[#1A1A1A]">
                    {JSON.stringify(state.responses, null, 2)}
                  </pre>
                </div>

                <div className="p-2.5 rounded bg-[#0D0D0D] border border-[#1A1A1A] space-y-1">
                  <p className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
                    Insights Descubiertos
                  </p>
                  <pre className="text-[9px] text-neutral-300 overflow-x-auto p-2 bg-[#050505] rounded border border-[#1A1A1A]">
                    {JSON.stringify(state.insights, null, 2)}
                  </pre>
                </div>
              </div>
            )}

            {/* STATE TAB */}
            {activeTab === 'state' && (
              <div className="space-y-2">
                <div className="p-2 rounded bg-[#0D0D0D] border border-[#1A1A1A] space-y-1 text-[11px]">
                  <p className="text-neutral-400">
                    Case ID: <span className="text-orange-400 font-bold">{state.session.caseId}</span>
                  </p>
                  <p className="text-neutral-400 truncate">
                    Session ID: <span className="text-neutral-300">{state.session.sessionId}</span>
                  </p>
                  <p className="text-neutral-400">
                    Current Exp: <span className="text-amber-400 font-bold">{state.progress.currentExperience}</span>
                  </p>
                  <p className="text-neutral-400">
                    Progress: <span className="text-emerald-400 font-bold">{state.progress.completionPercentage}%</span> ({state.progress.completedExperiences.length}/8)
                  </p>
                </div>
                <div className="p-2 rounded bg-[#050505] border border-[#1A1A1A] text-[10px] overflow-x-auto">
                  <pre className="text-neutral-400">{JSON.stringify(state, null, 2)}</pre>
                </div>
              </div>
            )}

            {/* EVENTS TAB */}
            {activeTab === 'events' && (
              <div className="space-y-1.5">
                {logs.length === 0 ? (
                  <p className="text-neutral-500 text-center py-4">No hay eventos registrados</p>
                ) : (
                  logs.slice(0, 40).map((log) => (
                    <div
                      key={log.id}
                      className="p-2 rounded bg-[#0D0D0D] border border-[#1A1A1A] text-[10px] space-y-0.5"
                    >
                      <div className="flex items-center justify-between text-orange-400 font-bold">
                        <span>{log.eventName}</span>
                        <span className="text-neutral-500 text-[9px]">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-neutral-400">Exp: {log.experience}</p>
                      {log.payload && Object.keys(log.payload).length > 0 && (
                        <pre className="text-[9px] text-neutral-500 overflow-x-auto">
                          {JSON.stringify(log.payload)}
                        </pre>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TOOLS TAB */}
            {activeTab === 'tools' && (
              <div className="space-y-2">
                <p className="text-[10px] text-neutral-400 uppercase tracking-wider">
                  Navegación Rápida
                </p>
                <div className="grid grid-cols-2 gap-1.5">
                  {EXPERIENCES.map((exp) => (
                    <button
                      key={exp.id}
                      type="button"
                      onClick={() => onGoToExperience(exp.id)}
                      className={`px-2 py-1.5 rounded border text-[10px] text-left truncate transition-colors ${
                        state.progress.currentExperience === exp.id
                          ? 'bg-orange-600/20 border-orange-500 text-orange-300'
                          : 'bg-[#0D0D0D] border-[#1A1A1A] text-neutral-400 hover:text-white'
                      }`}
                    >
                      0{exp.number}. {exp.name}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => onGoToExperience('sales_page')}
                    className="col-span-2 px-2 py-1.5 rounded border border-orange-500/30 bg-orange-500/10 text-orange-400 text-[10px]"
                  >
                    Sales Page (/compra)
                  </button>
                </div>

                <div className="pt-2 border-t border-[#1A1A1A] space-y-1.5">
                  <button
                    type="button"
                    onClick={onUnlockAll}
                    className="w-full flex items-center justify-center gap-2 p-2 rounded bg-orange-500/10 border border-orange-500/30 text-orange-400 hover:bg-orange-500/20"
                  >
                    <FastForward className="w-3 h-3" />
                    Desbloquear Todo (01-08)
                  </button>

                  <button
                    type="button"
                    onClick={onResetSession}
                    className="w-full flex items-center justify-center gap-2 p-2 rounded bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20"
                  >
                    <Trash2 className="w-3 h-3" />
                    Reiniciar Sesión (startNewSession)
                  </button>

                  <button
                    type="button"
                    onClick={onCorruptSession}
                    className="w-full flex items-center justify-center gap-2 p-2 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 text-[10px]"
                  >
                    <ShieldAlert className="w-3 h-3" />
                    Simular Corrupción LocalStorage
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
