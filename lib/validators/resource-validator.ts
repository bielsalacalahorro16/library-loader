import {
	ScriptStageLoaderItem,
	StyleStageLoaderItem,
} from '@interfaces/stage-loader/stage-loader-item.interface';
import { hasLength } from '@utils/utils';

export class ResourceValidator {
	public static validate(url: string) {
		if (url === '') throw new Error("The url can't be empty");
	}
	public static validateResources(
		scripts: ScriptStageLoaderItem[],
		styles: StyleStageLoaderItem[]
	) {
		if (!hasLength(scripts) && !hasLength(styles)) {
			throw new Error('Resources must not be empty');
		}
	}
}
