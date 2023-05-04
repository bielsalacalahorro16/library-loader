import LoadingStage from '../../enums/loading-stage.enum';
import ScriptLoaderType from '@enums/script-loader-type.enum';
import StyleLoaderType from '@enums/style-loader-type.enum';
import { BaseLoaderItem } from '@interfaces/base-loader-item.interface';

export enum ResourceType {
	Script = 'Script',
	Style = 'Style',
}
export interface BaseStageLoaderItem extends BaseLoaderItem {
	loadingStage?: LoadingStage;
	resourcesType: ResourceType;
}

export interface ScriptStageLoaderItem extends BaseStageLoaderItem {
	scriptLoaderType: ScriptLoaderType;
}

export interface StyleStageLoaderItem extends BaseStageLoaderItem {
	styleLoaderType: StyleLoaderType;
}

export interface StageResources {
	scripts: ScriptStageLoaderItem[];
	styles: StyleStageLoaderItem[];
}
