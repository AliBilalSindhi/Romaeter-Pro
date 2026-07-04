import React, { useState, useEffect } from 'react';
import { AndroidDevice, CustomROM, FlashingStep } from '../types';
import { generateInteractiveSteps } from '../data';
import { CheckCircle2, Circle, AlertTriangle, Lightbulb, Copy, Check, RotateCcw, Sliders } from 'lucide-react';

interface FlashingGuideProps {
  device: AndroidDevice;
  rom: CustomROM;
}

export default function FlashingGuide({ device, rom }: FlashingGuideProps) {
  const [steps, setSteps] = useState<FlashingStep[]>([]);
  const [checkedSteps, setCheckedSteps] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const storageKey = `romhub-guide-${device.id}-${rom.id}`;

  // Generate steps and load saved progress from localStorage
  useEffect(() => {
    const generatedSteps = generateInteractiveSteps(device, rom);
    setSteps(generatedSteps);

    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setCheckedSteps(JSON.parse(saved));
      } else {
        setCheckedSteps({});
      }
    } catch (e) {
      setCheckedSteps({});
    }
  }, [device, rom, storageKey]);

  const toggleStep = (stepId: string) => {
    const updated = {
      ...checkedSteps,
      [stepId]: !checkedSteps[stepId],
    };
    setCheckedSteps(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  const copyToClipboard = (text: string, stepId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(stepId);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const resetProgress = () => {
    if (window.confirm('Are you sure you want to reset your flashing checklist progress?')) {
      setCheckedSteps({});
      localStorage.removeItem(storageKey);
    }
  };

  // Calculate progress stats
  const totalSteps = steps.length;
  const completedSteps = steps.filter(s => checkedSteps[s.id]).length;
  const progressPercent = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Tracker Status Card */}
      <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-5 relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute -top-12 -left-12 w-28 h-28 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xs font-semibold text-white/40 uppercase tracking-widest font-mono">
              Interactive Flashing Guide
            </h3>
            <p className="text-lg font-serif italic text-zinc-100 mt-1">
              {rom.name} for {device.name}
            </p>
            <p className="text-xs text-white/50 mt-1 leading-relaxed">
              Follow these interactive steps sequentially to prevent soft-bricking your device.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs font-mono text-white/40">PROGRESS</div>
              <div className="text-base font-bold text-amber-500 font-mono">
                {completedSteps} / {totalSteps} Steps
              </div>
            </div>
            <button
              onClick={resetProgress}
              title="Reset progress checklist"
              className="p-2 bg-white/5 border border-white/10 hover:border-white/25 text-white/60 hover:text-white rounded-xl transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-5 space-y-2">
          <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden border border-white/5">
            <div
              className="bg-amber-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] font-mono text-white/40">
            <span>STARTING PREPARATION</span>
            <span>{progressPercent}% COMPLETED</span>
            <span>SUCCESSFUL REBOOT</span>
          </div>
        </div>
      </div>

      {/* Stepper Steps list */}
      <div className="space-y-4">
        {steps.map((step, index) => {
          const isCompleted = !!checkedSteps[step.id];
          const isCurrent = index === 0 || !!checkedSteps[steps[index - 1]?.id];

          return (
            <div
              key={step.id}
              className={`border rounded-2xl transition-all duration-300 overflow-hidden ${
                isCompleted
                  ? 'bg-white/5 border-white/5 opacity-60'
                  : isCurrent
                  ? 'bg-[#0a0a0a] border-amber-500/60 shadow-lg shadow-amber-950/5'
                  : 'bg-[#0a0a0a]/40 border-white/5'
              }`}
            >
              {/* Header bar */}
              <div
                onClick={() => toggleStep(step.id)}
                className="p-4 flex items-start gap-3 cursor-pointer select-none hover:bg-white/5 transition-colors"
              >
                <div className="mt-0.5 shrink-0">
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-amber-500 fill-amber-500/10" />
                  ) : (
                    <Circle className={`w-5 h-5 ${isCurrent ? 'text-amber-500 animate-pulse' : 'text-white/30'}`} />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-mono text-white/50 bg-white/5 px-1.5 py-0.5 rounded border border-white/10">
                      STEP {index + 1}
                    </span>
                    <h4 className={`text-sm font-serif italic truncate ${isCompleted ? 'text-white/40 line-through' : 'text-zinc-200'}`}>
                      {step.title}
                    </h4>
                  </div>
                  <p className="text-xs text-white/50 mt-2 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>

              {/* Collapsible Content */}
              {!isCompleted && (
                <div className="px-4 pb-4 pt-1 border-t border-white/5 space-y-3.5 bg-[#050505]/30">
                  {/* Command box with single click copy */}
                  {step.command && (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider">
                          Run in ADB/Fastboot Shell:
                        </span>
                        <button
                          onClick={() => copyToClipboard(step.command!, step.id)}
                          className="flex items-center gap-1 text-[10px] font-mono text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
                        >
                          {copiedId === step.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy Command</span>
                            </>
                          )}
                        </button>
                      </div>
                      <div className="p-3 bg-[#0a0a0a] rounded-xl border border-white/10 font-mono text-xs text-white/80 break-all select-all flex justify-between items-center group">
                        <span className="whitespace-pre-wrap">{step.command}</span>
                      </div>
                    </div>
                  )}

                  {/* Warning Alerts */}
                  {step.warning && (
                    <div className="flex gap-2 p-3 bg-rose-500/5 border border-rose-500/10 rounded-xl text-xs text-rose-400 leading-relaxed">
                      <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
                      <div>
                        <span className="font-bold font-serif italic">Warning: </span>
                        {step.warning}
                      </div>
                    </div>
                  )}

                  {/* Tips Indicator */}
                  {step.tips && (
                    <div className="flex gap-2 p-3 bg-amber-500/5 border border-amber-500/10 rounded-xl text-xs text-amber-200/70 leading-relaxed">
                      <Lightbulb className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" />
                      <div>
                        <span className="font-bold font-serif italic">Tip: </span>
                        {step.tips}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
