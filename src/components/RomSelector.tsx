import React, { useState, useEffect } from 'react';
import { AndroidDevice, CustomROM, RomDownloadInfo } from '../types';
import { CUSTOM_ROMS, getDownloadInfo } from '../data';
import { Layers, Info, CheckCircle2, Star, Download, ShieldCheck, AlertCircle } from 'lucide-react';

interface RomSelectorProps {
  device: AndroidDevice;
  selectedRom: CustomROM | null;
  onSelectRom: (rom: CustomROM) => void;
}

export default function RomSelector({ device, selectedRom, onSelectRom }: RomSelectorProps) {
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null);
  const [downloadInfo, setDownloadInfo] = useState<RomDownloadInfo | null>(null);

  // Filter custom ROMs compatible with active device
  const compatibleRoms = CUSTOM_ROMS.filter(rom => device.supportedROMs.includes(rom.id));

  // Reset progress and calculate download info when device or ROM changes
  useEffect(() => {
    setDownloadProgress(null);
    if (selectedRom) {
      setDownloadInfo(getDownloadInfo(selectedRom.id, device.codename));
    } else {
      setDownloadInfo(null);
    }
  }, [selectedRom, device]);

  const startSimulatedDownload = () => {
    if (downloadProgress !== null) return;
    setDownloadProgress(0);
    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev === null) return null;
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.floor(Math.random() * 15) + 5;
      });
    }, 200);
  };

  return (
    <div className="space-y-6">
      {/* Compatible ROM list */}
      <div>
        <h3 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-3 font-mono">
          Compatible Custom ROMs ({compatibleRoms.length})
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {compatibleRoms.map((rom) => {
            const isSelected = selectedRom?.id === rom.id;
            return (
              <button
                key={rom.id}
                onClick={() => onSelectRom(rom)}
                className={`text-left p-3.5 rounded-xl border transition-all duration-300 relative ${
                  isSelected
                    ? 'bg-white/5 border-amber-500 shadow-md shadow-amber-950/10'
                    : 'bg-[#0a0a0a] border-white/5 hover:border-white/10 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-serif italic text-zinc-100">{rom.name}</h4>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-white/50 border border-white/10">
                    {rom.type}
                  </span>
                </div>
                <p className="text-xs text-white/50 line-clamp-2 leading-relaxed">
                  {rom.description}
                </p>
                <div className="flex items-center justify-between mt-3 text-[10px] font-mono text-white/40">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                    <span className="text-white/70">{rom.avgRating}</span>
                  </div>
                  <span>{rom.androidVersion}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected ROM Detailed Profile */}
      {selectedRom ? (
        <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-5 space-y-5 relative overflow-hidden">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/5">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-serif italic text-zinc-100">{selectedRom.name} for {device.name}</h2>
                <span className="px-2 py-0.5 text-[10px] bg-amber-500/15 text-amber-400 border border-amber-500/25 rounded-full font-mono">
                  {selectedRom.androidVersion}
                </span>
              </div>
              <p className="text-xs text-white/40 mt-1 font-mono">
                Maintained by <span className="text-white/70 font-semibold">{selectedRom.maintainer}</span>
              </p>
            </div>
            
            <div className="flex items-center gap-2 text-xs font-mono self-start sm:self-auto bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 text-white/70">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Official Build
            </div>
          </div>

          {/* Key ROM Specs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Features */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" /> Key Features
              </h4>
              <ul className="space-y-2">
                {selectedRom.features.map((feat, idx) => (
                  <li key={idx} className="text-xs text-white/60 flex items-start gap-1.5 leading-relaxed">
                    <span className="text-amber-500 font-bold mt-0.5">•</span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Google Apps & GApps Info */}
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                  <Info className="w-3.5 h-3.5 text-amber-400" /> Google Apps Status
                </h4>
                <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-xs">
                  {selectedRom.hasGApps === 'preinstalled' && (
                    <div className="flex items-start gap-2 text-white/80">
                      <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-emerald-400 font-serif italic">GApps Included</p>
                        <p className="text-[11px] text-white/50 mt-0.5 leading-relaxed">Google Services and Play Store come pre-installed. Setup is identical to standard pixel phone.</p>
                      </div>
                    </div>
                  )}
                  {selectedRom.hasGApps === 'vanilla-only' && (
                    <div className="flex items-start gap-2 text-white/80">
                      <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-amber-400 font-serif italic">Vanilla Core (No GApps)</p>
                        <p className="text-[11px] text-white/50 mt-0.5 leading-relaxed">Google services are NOT pre-installed. Excellent for de-googled paths, or install NikGApps separately during flashing steps.</p>
                      </div>
                    </div>
                  )}
                  {selectedRom.hasGApps === 'optional' && (
                    <div className="flex items-start gap-2 text-white/80">
                      <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-amber-400 font-serif italic">Optional GApps</p>
                        <p className="text-[11px] text-white/50 mt-0.5 leading-relaxed">Separate vanilla and GApps editions are available. Installation guide provides steps for both options.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Changelog snippets */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wider font-mono">Latest Changelog</h4>
                <div className="text-[11px] text-white/50 space-y-1.5 leading-relaxed bg-white/5 p-3 rounded-lg border border-white/5 font-mono">
                  {selectedRom.changelog.slice(0, 2).map((ch, idx) => (
                    <p key={idx} className="flex gap-1">
                      <span className="text-white/25">-</span>
                      <span>{ch}</span>
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Download Simulator Section */}
          {downloadInfo && (
            <div className="pt-4 border-t border-white/5">
              <div className="p-4 bg-white/5 rounded-xl border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-white/40 font-mono">FILE:</span>
                    <span className="text-xs font-bold text-white/80 font-mono truncate max-w-[280px] sm:max-w-md block">
                      {downloadInfo.filename}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-white/40 font-mono">
                    <span>Size: <span className="text-white/80">{downloadInfo.fileSize}</span></span>
                    <span className="truncate max-w-[180px]">SHA256: <span className="text-white/80">{downloadInfo.checksum}</span></span>
                  </div>
                </div>

                <div className="w-full md:w-auto shrink-0">
                  {downloadProgress === null ? (
                    <button
                      onClick={startSimulatedDownload}
                      className="w-full md:w-auto flex items-center justify-center gap-2 bg-white text-black hover:bg-amber-500 px-5 py-2.5 rounded-full font-medium text-xs transition-colors shadow shadow-black/40 cursor-pointer uppercase tracking-wider font-sans"
                    >
                      <Download className="w-4 h-4" /> Download Image
                    </button>
                  ) : downloadProgress < 100 ? (
                    <div className="w-full md:w-48 space-y-1.5">
                      <div className="flex justify-between text-[10px] font-mono text-white/50">
                        <span>Downloading...</span>
                        <span>{downloadProgress}%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-amber-500 h-1.5 rounded-full transition-all duration-200"
                          style={{ width: `${downloadProgress}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="text-emerald-400 text-xs font-mono font-bold flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2.5 rounded-xl">
                      <CheckCircle2 className="w-4 h-4" /> Package Ready for Flashing
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-10 bg-white/5 rounded-2xl border border-white/5 border-dashed text-center">
          <Layers className="w-8 h-8 text-white/20 mb-2" />
          <h3 className="text-xs font-semibold text-white/60">No Custom ROM Selected</h3>
          <p className="text-[11px] text-white/40 mt-1.5 max-w-sm leading-relaxed">
            Select one of the compatible custom ROMs above to view deep features, GApps configuration, and download package files.
          </p>
        </div>
      )}
    </div>
  );
}
