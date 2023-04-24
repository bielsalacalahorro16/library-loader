import { ScriptLoaderItem, StyleLoaderItem } from "./loader-item";

export interface BaseLoader {
  orderByPriority(): Promise<ScriptLoaderItem[] | StyleLoaderItem[]>;
  load(): Promise<void>;
  mapStylePromise();
  mapScriptPromise();
}