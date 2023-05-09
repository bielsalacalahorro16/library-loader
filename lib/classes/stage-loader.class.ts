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

//TODO: Add code documentation
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
		for (const loadingStage in LoadingStage) {
			try {
				await Promise.all([this.loadAllResources(loadingStage)]);
			} catch (error) {
				console.error(error);
			}
		}
		if (
			this._configuration.callback &&
			typeof this._configuration.callback === 'function'
		) {
			//TODO: Check if needs to be moved to dedicated function
			try {
				await Promise.all([this._configuration.callback()]);
			} catch (error) {
				console.error(error);
			}
		}
	}

	private async loadAllResources(loadingStage: string): Promise<void> {
		const { styles, scripts } = this.getResourcesByLoadingStage(loadingStage);
		if (styles.length > 0 || scripts.length > 0) {
			await Promise.all([
				this.scriptsStageLoader(scripts),
				this.stylesStageLoader(styles),
			]);
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

	private async stylesStageLoader(
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
							? DOMHelper.mapInlineStyle(url)
							: DOMHelper.mapHeaderStyle(url);
					});
			}
		);
		await Promise.all(promises);
	}

	private async scriptsStageLoader(
		scripts: ScriptStageLoaderItem[]
	): Promise<void> {
		const promises: Promise<void>[] = scripts.flatMap(
			({ scriptLoaderType, urls }) => {
				const nonDuplicatedUrls: string[] = removeDuplicatesInArray(urls);
				return nonDuplicatedUrls
					.filter((url: string) => !DOMHelper.isLoadedInDOM(url, true))
					.map((url) => {
						ResourceValidator.validate(url);
						return DOMHelper.mapScript(url, scriptLoaderType);
					});
			}
		);
		await Promise.all(promises);
	}
}
