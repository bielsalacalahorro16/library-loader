import LoadingStage from '../enums/loading-stage.enum';
import StyleLoaderType from '../enums/style-loader-type.enum';
import DOMHelper from '../helpers/DOM-helper';
import { LoaderConfiguration } from '../interfaces/loader-configuration.interface';
import {
	ScriptStageLoaderItem,
	StyleStageLoaderItem,
} from '../interfaces/stage-loader/stage-loader-item.interface';

interface ResouresByLoadingStage {
	preLoad: (ScriptStageLoaderItem | StyleStageLoaderItem)[];
	load: (ScriptStageLoaderItem | StyleStageLoaderItem)[];
}

export class StageLoader {
	private readonly _scripts: ScriptStageLoaderItem[];
	private readonly _styles: StyleStageLoaderItem[];
	private readonly _configuration: LoaderConfiguration;

	constructor(
		scripts: ScriptStageLoaderItem[],
		styles: StyleStageLoaderItem[],
		configuration: LoaderConfiguration
	) {
		this._scripts = scripts;
		this._styles = styles;
		this._configuration = configuration;
	}

	private execute() {
		//Stage: preload
		if (
			this.checkScriptsLoadingStage(LoadingStage.PreLoad) ||
			this.checkStylesLoadingStage(LoadingStage.PreLoad)
		) {
			//Find all the matches for scripts and styles and load them
		}
		//Stage: load
		if (
			this.checkScriptsLoadingStage(LoadingStage.Load) ||
			this.checkStylesLoadingStage(LoadingStage.Load)
		) {
			//Find all the matches for scripts and styles and load them
		}
		//Stage: afterLoad
		if (
			this.checkScriptsLoadingStage(LoadingStage.AfterLoad) ||
			this.checkStylesLoadingStage(LoadingStage.AfterLoad)
		) {
			//Find all the matches for scripts and styles and load them
		}
	}

	//private getResourcesByloadingStage(): ResouresByLoadingStage {}

	private checkScriptsLoadingStage(stage: LoadingStage) {
		return this._scripts.some(
			(script: ScriptStageLoaderItem) => script.loadingStage === stage
		);
	}
	private checkStylesLoadingStage(stage: LoadingStage) {
		return this._styles.some(
			(script: StyleStageLoaderItem) => script.loadingStage === stage
		);
	}

	private async styleStageLoader(
		styles: StyleStageLoaderItem[]
	): Promise<void> {
		try {
			const promises: Promise<void>[] = styles.flatMap(
				({ styleLoaderType, urls }) => {
					return urls
						.filter((url: string) => !DOMHelper.isLoadedInDOM(url, false))
						.map((url: string) =>
							styleLoaderType === StyleLoaderType.InlineStyle
								? DOMHelper.loadInlineStyle(url)
								: DOMHelper.loadHeaderStyle(url)
						);
				}
			);
			await Promise.all(promises);
		} catch (e) {
			console.log(e);
		}
	}

	private async scriptStageLoader(
		scripts: ScriptStageLoaderItem[]
	): Promise<void> {
		const promises: Promise<void>[] = scripts.flatMap(
			({ scriptLoaderType, urls }) =>
				urls
					.filter((url: string) => !DOMHelper.isLoadedInDOM(url, true))
					.map((url) => DOMHelper.loadScript(url, scriptLoaderType))
		);
		await Promise.all(promises);
	}
}
