interface App {
  theme: Promise<string>;
  isDarkColors: () => boolean;
}

interface Ffmpeg {
  getPaths: () => Promise<{
    ffmpeg: string;
    ffprobe: string;
  }>;
  install: () => Promise<void>;
  isInstalled: () => Promise<boolean>;
}

declare type Eagle = {
  app: App;

  onPluginCreate: (callback: (plugin: any) => void) => void;

  onThemeChanged: (callback: (theme: string) => void) => void;
  item: {
    getSelected: () => Promise<any>;
  };

  extraModule: {
    ffmpeg?: Ffmpeg;
  };
};

declare const eagle: Eagle;
