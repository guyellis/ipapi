import { Reader } from 'maxmind'; // Import Reader as a named export from maxmind

declare module 'maxmind' {
  // Re-declare Callback and OpenOpts as they are not exported by the original module
  type Callback = () => void;
  interface OpenOpts {
    cache?: {
      max: number;
    };
    watchForUpdates?: boolean;
    watchForUpdatesNonPersistent?: boolean;
    watchForUpdatesHook?: Callback;
  }

  interface AnonymousPlusResponse extends AnonymousIPResponse {
    anonymizerConfidence?: number;
    networkLastSeen?: string;
    providerName?: string;
  }

  // Augment the 'open' function signature
  export const open: <T extends Response>(
    filepath: string,
    opts?: OpenOpts | undefined,
    cb?: Callback | undefined
  ) => Promise<Reader<T>>;

  // Augment the 'openSync' function signature
  export const openSync: <T extends Response>(
    filepath: string,
    opts?: OpenOpts | undefined
  ) => Reader<T>;
}
