import LoadingStage from '@enums/loading-stage.enum';
import StyleLoaderType from '../enums/style-loader-type.enum';
import DOMHelper from '../helpers/DOM-helper';
import { LoaderConfiguration } from '../interfaces/loader-configuration.interface';
import {
	ResourceType,
	ScriptStageLoaderItem,
	StageResources,
	StyleStageLoaderItem,
} from '../interfaces/stage-loader/stage-loader-item.interface';
import { ResourceValidator } from '../validators/resource-validator';
import Loader from './loader-abstract.class';
import { removeDuplicatesInArray } from '@utils/utils';

export class StageLoader extends Loader {
	private readonly _scripts: ScriptStageLoaderItem[];
	private readonly _styles: StyleStageLoaderItem[];

	constructor(
		scripts: ScriptStageLoaderItem[],
		styles: StyleStageLoaderItem[],
		configuration: LoaderConfiguration
	) {
		super(configuration);
		this._scripts = scripts;
		this._styles = styles;
	}

	public async loadResources(): Promise<void> {
		ResourceValidator.validateResources(this._scripts, this._styles);
		try {
			for (const loadingStage in LoadingStage) {
				const { styles, scripts } =
					this.getResourcesByLoadingStage(loadingStage);
				if (styles.length > 0 || scripts.length > 0) {
					await Promise.all([
						this.scriptStageLoader(scripts),
						this.styleStageLoader(styles),
					]);
				}
			}
			if (
				this._configuration.callback &&
				typeof this._configuration.callback === 'function'
			) {
				await this._configuration.callback();
			}
		} catch (error) {
			console.error(error);
		}
	}

	private getResourcesByLoadingStage(loadingStage: string): StageResources {
		return {
			scripts: this._scripts.filter(
				(x) =>
					x.loadingStage === loadingStage &&
					x.resourcesType === ResourceType.Script
			) as ScriptStageLoaderItem[],
			styles: this._styles.filter(
				(x) =>
					x.loadingStage === loadingStage &&
					x.resourcesType === ResourceType.Script
			) as StyleStageLoaderItem[],
		};
	}

	private async styleStageLoader(
		styles: StyleStageLoaderItem[]
	): Promise<void> {
		const promises: Promise<void>[] = styles.flatMap(
			({ styleLoaderType, urls }) => {
				const nonDuplicatedUrls: string[] = removeDuplicatesInArray(urls);
				return nonDuplicatedUrls
					.filter((url: string) => !DOMHelper.isLoadedInDOM(url, false))
					.map((url: string) => {
						ResourceValidator.validate(url);
						return styleLoaderType === StyleLoaderType.InlineStyle
							? DOMHelper.loadInlineStyle(url)
							: DOMHelper.loadHeaderStyle(url);
					});
			}
		);
		await Promise.all(promises);
	}

	private async scriptStageLoader(
		scripts: ScriptStageLoaderItem[]
	): Promise<void> {
		const promises: Promise<void>[] = scripts.flatMap(
			({ scriptLoaderType, urls }) => {
				const nonDuplicatedUrls: string[] = removeDuplicatesInArray(urls);
				return nonDuplicatedUrls
					.filter((url: string) => !DOMHelper.isLoadedInDOM(url, true))
					.map((url) => {
						ResourceValidator.validate(url);
						return DOMHelper.loadScript(url, scriptLoaderType);
					});
			}
		);
		await Promise.all(promises);
	}
}
