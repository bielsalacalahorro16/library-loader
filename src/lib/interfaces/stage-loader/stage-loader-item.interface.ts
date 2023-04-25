import LoadingStage from "../../enums/loading-stage.enum";
import ScriptLoaderType from "../../enums/script-loader-type.enum";
import StyleLoaderType from "../../enums/style-loader-type.enum";
import { BaseLoaderItem } from "../base-loader-item.interface";

export interface BaseStageLoaderItem extends BaseLoaderItem {
  loadingStage?: LoadingStage
}

export interface ScriptStageLoaderItem extends BaseStageLoaderItem {
  ScriptLoaderType: ScriptLoaderType
}

export interface StyleStageLoaderItem extends BaseStageLoaderItem {
  StyleLoaderType: StyleLoaderType
}
