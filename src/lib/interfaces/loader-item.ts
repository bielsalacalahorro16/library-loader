import ScriptLoaderType from "../enums/script-loader-type.enum";
import Priority from "../enums/priority.enum";
import StyleLoaderType from "../enums/style-loader-type.enum";

export interface BaseLoaderItem {
  urls: string[];
  priority: Priority
}

export interface ScriptLoaderItem extends BaseLoaderItem {
  ScriptLoaderType: ScriptLoaderType
}

export interface StyleLoaderItem extends BaseLoaderItem {
  StyleLoaderType: StyleLoaderType
}

