import React, { useState, useMemo } from 'react';
import { ANDROID_DEVICES } from './data';
import { AndroidDevice, CustomROM } from './types';
import DeviceCard from './components/DeviceCard';
import RomSelector from './components/RomSelector';
import FlashingGuide from './components/FlashingGuide';
import AiAssistant from './components/AiAssistant';
import { Search, Sparkles, BookOpen, Terminal, Info, ShieldCheck, Cpu, Sliders } from 'lucide-react';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDevice, setSelectedDevice] = useState<AndroidDevice>(ANDROID_DEVICES[0]);
  const [selectedRom, setSelectedRom] = useState<CustomROM | null>(null);
  const [activeTab, setActiveTab] = useState<'guide' | 'ai'>('guide');

  // Filter devices based on name, brand, or codename
  const filteredDevices = useMemo(() => {
    return ANDROID_DEVICES.filter(device => 
      device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.codename.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleDeviceSelect = (device: AndroidDevice) => {
    setSelectedDevice(device);
    setSelectedRom(null); // Reset ROM when device changes
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#e0e0e0] font-sans selection:bg-amber-500/30 selection:text-amber-200">
      
      {/* Upper Status Accent Header */}
      <div className="bg-[#0a0a0a] border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Logo & Name */}
          <div className="flex items-center gap-4">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-amber-500/20 border border-amber-500/50">
              <div className="w-5 h-5 bg-amber-500 rounded-full blur-[2px]"></div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-serif italic tracking-tight text-white">
                  Romæter <span className="text-xs font-sans not-italic text-amber-500 tracking-widest uppercase ml-1">Pro</span>
                </span>
                <span className="px-1.5 py-0.5 text-[9px] font-mono bg-white/5 border border-white/10 text-amber-400 rounded">
                  v1.2-STABLE
                </span>
              </div>
              <p className="text-xs text-white/50 font-serif italic mt-0.5">
                Surgical custom recovery & Android ROM flashing interface
              </p>
            </div>
          </div>

          {/* Quick Config Display status bar */}
          <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/10 text-xs font-mono">
            <span className="text-white/40">ACTIVE TARGET:</span>
            <span className="text-amber-500 font-bold">{selectedDevice.name}</span>
            <span className="text-white/10">|</span>
            <span className="text-white/40">CODENAME:</span>
            <span className="text-white font-bold">{selectedDevice.codename}</span>
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Main Body */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Safe Flashing Disclaimer Panel */}
        <div className="mb-8 p-5 bg-amber-500/5 border border-amber-500/10 rounded-2xl flex gap-3 items-start relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />
          <Info className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-200/70 leading-relaxed font-serif italic">
            <span className="font-extrabold not-italic text-amber-500 uppercase tracking-wider text-[10px] mr-1.5">Surgical Warning:</span> 
            Flashing custom firmware, recoveries, and kernels involves system-level partition modifications. 
            Always backup critical partition tables and user contents beforehand. Flashing instructions generated are device-specific and require proper Fastboot drivers.
          </div>
        </div>

        {/* Layout grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Explorer Database (5 Cols) */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Device Selector Container */}
            <div className="bg-[#080808] border border-white/5 rounded-2xl p-5 space-y-5">
              
              <div>
                <h3 className="text-[11px] uppercase tracking-[0.2em] text-white/40 mb-1 px-1">
                  System target
                </h3>
                <h4 className="text-xl font-serif italic text-white px-1">
                  Select Device
                </h4>
              </div>

              {/* Custom Search bar */}
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter by brand, model, or codename (e.g. 'marble')..."
                  className="w-full bg-[#050505] border border-white/10 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 focus:outline-none rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-white/30"
                />
              </div>

              {/* Devices vertical grid scroll */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 max-h-[340px] overflow-y-auto pr-1">
                {filteredDevices.length > 0 ? (
                  filteredDevices.map((dev) => (
                    <DeviceCard
                      key={dev.id}
                      device={dev}
                      isSelected={selectedDevice.id === dev.id}
                      onSelect={handleDeviceSelect}
                    />
                  ))
                ) : (
                  <div className="text-center py-8 border border-white/5 border-dashed rounded-xl bg-[#050505]/40">
                    <p className="text-xs text-white/40">No matching android devices detected in repository.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Compatible ROM Selector (for the selected device) */}
            <div className="bg-[#080808] border border-white/5 rounded-2xl p-5">
              <div className="mb-5">
                <h3 className="text-[11px] uppercase tracking-[0.2em] text-white/40 mb-1 px-1">
                  Distribution Repository
                </h3>
                <h4 className="text-xl font-serif italic text-white px-1">
                  ROM Explorer
                </h4>
              </div>

              <RomSelector
                device={selectedDevice}
                selectedRom={selectedRom}
                onSelectRom={setSelectedRom}
              />
            </div>
          </div>

          {/* Right Column: Dynamic Stage & Assistant (7 Cols) */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* View Controller Tabs */}
            <div className="flex bg-[#0a0a0a] border border-white/10 rounded-2xl p-1.5 gap-2">
              <button
                onClick={() => setActiveTab('guide')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-xs tracking-wide uppercase transition-all cursor-pointer ${
                  activeTab === 'guide'
                    ? 'bg-white/5 text-amber-500 border border-white/5 shadow-md shadow-black/40'
                    : 'text-white/40 hover:text-white hover:bg-white/5'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                Flashing Instructions
              </button>
              <button
                onClick={() => setActiveTab('ai')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-xs tracking-wide uppercase transition-all cursor-pointer ${
                  activeTab === 'ai'
                    ? 'bg-white/5 text-amber-500 border border-white/5 shadow-md shadow-black/40'
                    : 'text-white/40 hover:text-white hover:bg-white/5'
                }`}
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                AI Flashing Advisor
              </button>
            </div>

            {/* Active view renderer */}
            {activeTab === 'guide' ? (
              selectedRom ? (
                <FlashingGuide device={selectedDevice} rom={selectedRom} />
              ) : (
                <div className="flex flex-col items-center justify-center p-14 bg-[#080808]/40 rounded-2xl border border-white/5 border-dashed text-center">
                  <Sliders className="w-10 h-10 text-white/20 mb-4" />
                  <h3 className="text-sm font-semibold text-white/80">Instruction Matrix Inactive</h3>
                  <p className="text-xs text-white/50 mt-2 max-w-sm leading-relaxed font-serif italic">
                    "Please select a distribution in the ROM Explorer panel to establish a secure custom partition instruction path."
                  </p>
                </div>
              )
            ) : (
              <AiAssistant />
            )}
          </div>
        </div>
      </main>

      {/* Modern Developer Footnote */}
      <footer className="bg-[#0a0a0a] border-t border-white/10 mt-16 py-8 text-center text-xs text-white/40 font-mono">
        <div className="max-w-7xl mx-auto px-6 space-y-1">
          <p>© 2026 Romæter Project. All rights reserved.</p>
          <p className="text-[10px] text-white/20">Designed for advanced hardware modification and custom kernel optimization research.</p>
        </div>
      </footer>
    </div>
  );
}
