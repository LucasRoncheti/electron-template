export {};

declare global {
  interface Window {
    api: {
      runPuppeteer: (url:string) => Promise<boolean>;
    };
  }
}
