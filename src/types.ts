export interface DeviceSpecs {
  cpu: string;
  ram: string;
  storage: string;
}

export interface AndroidDevice {
  id: string;
  brand: string;
  name: string;
  codename: string;
  releaseYear: number;
  supportedROMs: string[]; // List of custom ROM IDs
  recoveryType: 'TWRP' | 'OrangeFox' | 'Pixel Recovery' | 'Lineage Recovery' | 'crDroid Recovery';
  recoveryFilename: string;
  specs: DeviceSpecs;
  status: 'stable' | 'beta' | 'legacy';
}

export interface CustomROM {
  id: string;
  name: string;
  description: string;
  features: string[];
  androidVersion: string;
  hasGApps: 'preinstalled' | 'vanilla-only' | 'optional';
  officialBuilds: boolean;
  maintainer: string;
  avgRating: number;
  type: 'Pixel-like' | 'Feature-rich' | 'Minimalist' | 'Performance-oriented';
  changelog: string[];
}

export interface FlashingStep {
  id: string;
  title: string;
  description: string;
  command?: string;
  warning?: string;
  tips?: string;
}

export interface Message {
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

export interface RomDownloadInfo {
  filename: string;
  fileSize: string;
  checksum: string;
  downloadUrl: string;
  type: 'Recovery Flashable' | 'Fastboot Flashable';
}
