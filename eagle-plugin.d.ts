interface App {
  theme: Promise<string>;
}

declare type Eagle = {
  app: App;

  onPluginCreate: (callback: (plugin: any) => void) => void;

  onThemeChanged: (callback: (theme: string) => void) => void;
  item: {
    getSelected: () => Promise<any>;
  };
};

declare const eagle: Eagle;
