import React from 'react';
import { AndroidDevice } from '../types';
import { Smartphone, Cpu, ShieldCheck, Calendar } from 'lucide-react';

interface DeviceCardProps {
  device: AndroidDevice;
  isSelected: boolean;
  onSelect: (device: AndroidDevice) => void;
}

const DeviceCard: React.FC<DeviceCardProps> = ({ device, isSelected, onSelect }) => {
  return (
    <button
      onClick={() => onSelect(device)}
      className={`w-full text-left p-4 rounded-xl border transition-all duration-300 relative overflow-hidden group ${
        isSelected
          ? 'bg-white/5 border-amber-500 shadow-md shadow-amber-950/10'
          : 'bg-[#0a0a0a] border-white/5 hover:border-white/10 hover:bg-white/5'
      }`}
    >
      {/* Background Glow */}
      {isSelected && (
        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
      )}

      <div className="flex items-start justify-between">
        <div>
          <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
            {device.brand}
          </span>
          <h3 className="text-base font-serif italic text-zinc-100 mt-0.5 group-hover:text-amber-400 transition-colors">
            {device.name}
          </h3>
          <div className="flex items-center gap-2 mt-2">
            <span className="px-2 py-0.5 text-[10px] font-mono bg-white/5 text-white/60 rounded border border-white/10">
              {device.codename}
            </span>
            <span className="flex items-center gap-1 text-[11px] text-white/50 font-mono">
              <Calendar className="w-3.5 h-3.5 text-white/30" />
              {device.releaseYear}
            </span>
          </div>
        </div>

        <div className={`p-2 rounded-lg border transition-colors ${
          isSelected 
            ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' 
            : 'bg-white/5 text-white/40 border-white/5'
        }`}>
          <Smartphone className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-white/5 grid grid-cols-2 gap-2 text-[11px] text-white/55">
        <div className="flex items-center gap-1">
          <Cpu className="w-3.5 h-3.5 text-white/30 shrink-0" />
          <span className="truncate">{device.specs.cpu.split('(')[0]}</span>
        </div>
        <div className="flex items-center gap-1 justify-end">
          <ShieldCheck className="w-3.5 h-3.5 text-white/30 shrink-0" />
          <span className="capitalize">{device.status}</span>
        </div>
      </div>
    </button>
  );
};

export default DeviceCard;
