import { LoaderConfiguration } from '@interfaces/loader-configuration.interface';

abstract class Loader {
	protected readonly _configuration: LoaderConfiguration;

	constructor(configuration: LoaderConfiguration) {
		this._configuration = configuration;
	}

	public abstract loadResources(): Promise<void>;
}

export default Loader;
