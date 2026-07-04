import { AndroidDevice, CustomROM, RomDownloadInfo, FlashingStep } from './types';

export const CUSTOM_ROMS: CustomROM[] = [
  {
    id: 'lineageos',
    name: 'LineageOS',
    description: 'A free and open-source operating system for various devices, based on the Android mobile platform. It is the successor to CyanogenMod and focuses on stability, privacy, and security.',
    features: [
      'Clean, debloated, vanilla Android feel',
      'Advanced Privacy Guard for granular permission controls',
      'Long-term support for older legacy devices',
      'Custom Lineage Trust system security dashboard',
      'Built-in audio balancer and system profiles'
    ],
    androidVersion: 'Android 14 (U)',
    hasGApps: 'vanilla-only',
    officialBuilds: true,
    maintainer: 'LineageOS Project Team',
    avgRating: 4.8,
    type: 'Minimalist',
    changelog: [
      'Updated to Android 14 security patches',
      'New system-wide high-efficiency media codec support',
      'Refactored calculator and messaging apps for modern design',
      'Improved hardware-backed encryption support'
    ]
  },
  {
    id: 'pixelexperience',
    name: 'Pixel Experience',
    description: 'An AOSP-based ROM with Google apps included and all Pixel goodies (launcher, wallpapers, icons, fonts, boot animation). It aims to offer the maximum stability and security with custom Pixel-exclusive features.',
    features: [
      'Inbuilt Google Apps (GApps) package - no separate flash needed',
      'Pixel exclusive features (Now Playing, Call Screening, Magic Eraser)',
      'Unlimited Google Photos high-quality backup backup modifier',
      'Silky smooth UI with Pixel Monet coloring engine',
      'Excellent RAM management and battery optimization'
    ],
    androidVersion: 'Android 14 (U)',
    hasGApps: 'preinstalled',
    officialBuilds: true,
    maintainer: 'PE Dev Group',
    avgRating: 4.9,
    type: 'Pixel-like',
    changelog: [
      'Merged latest Google Pixel Feature Drop features',
      'Optimized thermal throttling profiles for Snapdragon processors',
      'Updated Pixel Launcher with smoother app launching animations',
      'Fixed fingerprint sensor latency issues on in-display scanners'
    ]
  },
  {
    id: 'evolutionx',
    name: 'Evolution X',
    description: 'A Pixel-themed ROM with rich customization features. It aims to provide a stable, clean AOSP experience while adding several "evolutionary" tools for custom styling, status bar tweaks, and custom hardware keys.',
    features: [
      'Evolver Theme Engine: Customize status bar, QS tiles, fonts, and clocks',
      'Inbuilt GApps with Pixel wallpapers and premium system sounds',
      'Gaming Mode with performance lock, touch sensitivity tuning, and screen record',
      'SafetyNet/Play Integrity certified out-of-the-box',
      'Custom locks, battery style customizer, and gesture controls'
    ],
    androidVersion: 'Android 14 (U)',
    hasGApps: 'preinstalled',
    officialBuilds: true,
    maintainer: 'Joey Huab & Team',
    avgRating: 4.7,
    type: 'Feature-rich',
    changelog: [
      'Redesigned QS Panel customizers with multi-line layout support',
      'Added option to spoof game profiles (90FPS in PUBG/MLBB)',
      'Fully customized Evolver dashboard with search integration',
      'Fixed fast-charging detection bugs for dynamic voltage adapters'
    ]
  },
  {
    id: 'crdroid',
    name: 'crDroid',
    description: 'Designed to improve the performance, reliability, and customizability of stock Android. Based primarily on LineageOS, it delivers an enormous amount of fine-grained tuning parameters without compromising speed.',
    features: [
      'Over 200+ distinct customization toggles',
      'Extremely light build with highly optimized kernel profiles',
      'Custom crDroid Settings dashboard (Status bar, lockscreen, buttons, navigation)',
      'Ad-away engine built directly into system hosts',
      'Pocket detection mode and custom sensor polling rates'
    ],
    androidVersion: 'Android 14 (U)',
    hasGApps: 'optional',
    officialBuilds: true,
    maintainer: 'Gabriel & Team crDroid',
    avgRating: 4.8,
    type: 'Performance-oriented',
    changelog: [
      'Merged Android-14.0.0_r45 tag',
      'Enhanced system-level Game Space with granular CPU locks',
      'Reduced deep-sleep battery drain to under 0.4%/hour',
      'Updated crDroid Launcher with custom icon pack support'
    ]
  },
  {
    id: 'paranoidandroid',
    name: 'Paranoid Android',
    description: 'A legendary custom ROM famous for its gorgeous aesthetic designs, custom UI enhancements, and incredible stability. It focuses on taking standard Android and elevating it with refined, artistic features.',
    features: [
      'Stunning, custom-designed stock apps and custom music player',
      'AOSPA Glyph interface integration for modern devices',
      'Brilliant custom wallpapers and animations (Abstrax)',
      'Advanced gesture system and custom multitasking features (Halo/Pie)',
      'Sublime, customized Dolby Atmos profiles built-in'
    ],
    androidVersion: 'Android 14 (U)',
    hasGApps: 'preinstalled',
    officialBuilds: true,
    maintainer: 'AOSPA Team',
    avgRating: 4.9,
    type: 'Pixel-like',
    changelog: [
      'Re-written audio subsystem for high-fidelity LDAC output',
      'Added support for custom custom-drawn ambient clock faces',
      'Optimized kernel schedulers for smoother frame rates (U-Touch)',
      'Fixed dynamic island/notification capsule overlays'
    ]
  }
];

export const ANDROID_DEVICES: AndroidDevice[] = [
  {
    id: 'pixel7',
    brand: 'Google',
    name: 'Pixel 7',
    codename: 'panther',
    releaseYear: 2022,
    supportedROMs: ['lineageos', 'pixelexperience', 'evolutionx', 'paranoidandroid'],
    recoveryType: 'Pixel Recovery',
    recoveryFilename: 'recovery-panther.img',
    specs: {
      cpu: 'Google Tensor G2 (5nm)',
      ram: '8GB LPDDR5',
      storage: '128GB/256GB UFS 3.1'
    },
    status: 'stable'
  },
  {
    id: 'pocof5',
    brand: 'Xiaomi (Poco)',
    name: 'Poco F5',
    codename: 'marble',
    releaseYear: 2023,
    supportedROMs: ['lineageos', 'crdroid', 'evolutionx', 'paranoidandroid'],
    recoveryType: 'OrangeFox',
    recoveryFilename: 'OrangeFox-marble-Unofficial.zip',
    specs: {
      cpu: 'Snapdragon 7+ Gen 2 (4nm)',
      ram: '8GB/12GB LPDDR5',
      storage: '256GB UFS 3.1'
    },
    status: 'stable'
  },
  {
    id: 'oneplus11',
    brand: 'OnePlus',
    name: 'OnePlus 11',
    codename: 'salami',
    releaseYear: 2023,
    supportedROMs: ['lineageos', 'crdroid', 'paranoidandroid'],
    recoveryType: 'TWRP',
    recoveryFilename: 'twrp-3.7.0-salami.img',
    specs: {
      cpu: 'Snapdragon 8 Gen 2 (4nm)',
      ram: '8GB/12GB/16GB LPDDR5X',
      storage: '128GB/256GB/512GB UFS 4.0'
    },
    status: 'stable'
  },
  {
    id: 'phone2',
    brand: 'Nothing',
    name: 'Phone (2)',
    codename: 'pong',
    releaseYear: 2023,
    supportedROMs: ['lineageos', 'evolutionx', 'paranoidandroid'],
    recoveryType: 'OrangeFox',
    recoveryFilename: 'OrangeFox-pong-Official.img',
    specs: {
      cpu: 'Snapdragon 8+ Gen 1 (4nm)',
      ram: '8GB/12GB LPDDR5',
      storage: '128GB/256GB/512GB UFS 3.1'
    },
    status: 'stable'
  },
  {
    id: 'redminote10pro',
    brand: 'Xiaomi (Redmi)',
    name: 'Redmi Note 10 Pro',
    codename: 'sweet',
    releaseYear: 2021,
    supportedROMs: ['lineageos', 'pixelexperience', 'crdroid', 'evolutionx'],
    recoveryType: 'OrangeFox',
    recoveryFilename: 'OrangeFox-sweet-Stable.zip',
    specs: {
      cpu: 'Snapdragon 732G (8nm)',
      ram: '6GB/8GB LPDDR4X',
      storage: '64GB/128GB UFS 2.2'
    },
    status: 'stable'
  }
];

export function getDownloadInfo(romId: string, codename: string): RomDownloadInfo {
  const romName = CUSTOM_ROMS.find(r => r.id === romId)?.name || 'ROM';
  const cleanRom = romName.toLowerCase().replace(/\s+/g, '');
  const version = '14.0';
  const date = '20260701';
  
  return {
    filename: `${romName}-${version}-${date}-OFFICIAL-${codename}.zip`,
    fileSize: romId === 'lineageos' || romId === 'crdroid' ? '1.2 GB' : '2.1 GB',
    checksum: Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
    downloadUrl: `https://downloads.customromhub.org/roms/${romId}/${codename}/${romName}-${version}-${date}-OFFICIAL-${codename}.zip`,
    type: 'Recovery Flashable'
  };
}

export function generateInteractiveSteps(device: AndroidDevice, rom: CustomROM): FlashingStep[] {
  const steps: FlashingStep[] = [];
  
  steps.push({
    id: 'backup',
    title: 'Backup & Prerequisites',
    description: 'Ensure your phone has at least 60% battery. Perform a full backup of all apps, photos, and messages. This process WILL wipe your entire internal storage completely.',
    tips: 'Use Google Backup or copy your folders manually to a computer/PC.'
  });

  steps.push({
    id: 'bootloader',
    title: 'Unlock Bootloader',
    description: `Unlock the bootloader on your ${device.name}. For ${device.brand} devices, this requires enabling Developer Options, toggling "OEM Unlocking" and USB Debugging, and executing the unlock sequence.`,
    warning: 'Unlocking the bootloader voids your manufacturer warranty and resets your device to factory settings.',
    tips: device.brand.includes('Xiaomi') ? 'Use the Mi Unlock Tool and wait for the requested cooldown period (usually 168 hours).' : 'For Pixels, run "fastboot flashing unlock" in command prompt.'
  });

  steps.push({
    id: 'recovery',
    title: `Flash Custom Recovery (${device.recoveryType})`,
    description: `Install the recommended recovery environment (${device.recoveryType}) for ${device.codename}. Boot your device into Bootloader/Fastboot Mode (Power + Volume Down).`,
    command: device.recoveryType === 'OrangeFox' || device.recoveryType === 'TWRP'
      ? `fastboot flash recovery ${device.recoveryFilename}\nfastboot boot ${device.recoveryFilename}`
      : `fastboot flash vendor_boot ${device.recoveryFilename.replace('.img', '-vendor_boot.img')}\nfastboot flash boot ${device.recoveryFilename}`,
    warning: 'Ensure fastboot drivers are properly installed on your computer. Use a high-quality original USB cable connected to a USB 2.0 port if possible.',
    tips: `Keep your recovery file "${device.recoveryFilename}" inside your adb/platform-tools folder.`
  });

  steps.push({
    id: 'wipe',
    title: 'Wipe and Format Data',
    description: 'Boot into recovery. Navigate to Wipe/Format options. You must perform a Factory Reset and Format Data (typing "yes") to remove stock hardware encryption.',
    warning: 'Do NOT reboot your device after formatting data until you successfully flash/sideload the new custom ROM zip, otherwise you will have no OS installed.',
    tips: 'In OrangeFox/TWRP, navigate to Partition Manager -> Data -> Format Data -> Type "yes".'
  });

  steps.push({
    id: 'flash',
    title: `Flash ${rom.name} ROM Package`,
    description: `Sideload the custom ROM package to install ${rom.name} on your device. Connect your device in recovery sideload mode (Apply Update -> Apply from ADB, or Advanced -> ADB Sideload).`,
    command: `adb sideload ${rom.name.toLowerCase().replace(/\s+/g, '')}-14.0-OFFICIAL-${device.codename}.zip`,
    tips: 'Watch the percentage in your terminal. It is normal for it to stop at 47% or 94% on the computer side and say "Total xfer: 1.00x", which indicates success.'
  });

  if (rom.hasGApps === 'vanilla-only') {
    steps.push({
      id: 'gapps',
      title: 'Flash GApps Package (Optional)',
      description: `Since ${rom.name} is a Vanilla ROM (does not include Google Services by default), you can now flash a Google Apps package (like MindTheGapps or NikGApps).`,
      command: `adb sideload MindTheGapps-14.0.0-arm64-${device.codename}.zip`,
      tips: 'If you do not want Google Services (microG/De-Googled path), you can skip this step.'
    });
  }

  steps.push({
    id: 'reboot',
    title: 'Final Reboot & Setup',
    description: 'Reboot system from the recovery main menu. The first boot might take up to 3 to 5 minutes as Android configures system services.',
    warning: 'If your device reboots back into Fastboot or Recovery, it means you have encryption mismatches. Boot back to recovery and format data again.',
    tips: 'Once booted, complete the Android onboarding wizard. You can now root using Magisk or configure SafetyNet!'
  });

  return steps;
}
