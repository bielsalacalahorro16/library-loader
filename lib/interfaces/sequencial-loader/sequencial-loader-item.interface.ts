import Priority from '../../enums/priority.enum';
import ScriptLoaderType from '../../enums/script-loader-type.enum';
import StyleLoaderType from '../../enums/style-loader-type.enum';
import { BaseLoaderItem } from '../base-loader-item.interface';

export interface BaseSequencialLoaderItem extends BaseLoaderItem {
	priority: Priority;
}

export interface ScriptSequencialLoaderItem extends BaseSequencialLoaderItem {
	scriptLoaderType: ScriptLoaderType;
}

export interface StyleSequencialItem extends BaseSequencialLoaderItem {
	styleLoaderType: StyleLoaderType;
}
