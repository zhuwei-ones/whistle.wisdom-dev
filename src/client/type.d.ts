declare var __VERSION__: string;



declare module '*.less' {
    const use: () => void;
    const unuse: () => void;
    export { use, unuse };
  }
  