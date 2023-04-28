import LoadingStage from '../enums/loading-stage.enum';
import StyleLoaderType from '../enums/style-loader-type.enum';
import DOMHelper from '../helpers/DOM-helper';
import { LoaderConfiguration } from '../interfaces/loader-configuration.interface';
import {
	ResourceType,
	ScriptStageLoaderItem,
	StyleStageLoaderItem,
} from '../interfaces/stage-loader/stage-loader-item.interface';

interface ResouresByLoadingStage {
	resources: (ScriptStageLoaderItem | StyleStageLoaderItem)[];
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

	public async execute(): Promise<void> {
		for (const loadingStage in LoadingStage) {
			const { resources } = this.getResourcesByloadingStage(loadingStage);
			if (resources.length > 0) {
				const scripts: ScriptStageLoaderItem[] = resources.filter(
					(x) => x.resourcesType === ResourceType.Script
				) as ScriptStageLoaderItem[];
				const styles: StyleStageLoaderItem[] = resources.filter(
					(x) => x.resourcesType === ResourceType.Style
				) as StyleStageLoaderItem[];

				await Promise.all([
					this.scriptStageLoader(scripts),
					this.styleStageLoader(styles),
				]);
			}
		}
	}

	private getResourcesByloadingStage(
		loadingStage: string
	): ResouresByLoadingStage {
		return {
			resources: [
				...this._scripts.filter((x) => x.loadingStage === loadingStage),
				...this._styles.filter((x) => x.loadingStage === loadingStage),
			],
		};
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
