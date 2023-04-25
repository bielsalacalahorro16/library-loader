export interface BaseLoader {
  load(): Promise<void>;
}