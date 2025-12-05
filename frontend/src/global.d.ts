export {};

declare global {
  interface Window {
    api: {
      runPuppeteer: (url: string) => Promise<boolean>;
      onUpdateStatus: (callback: (message: string) => void) => void;
    };
  }
}
