import { LoaderConfiguration } from '../interfaces/loader-configuration.interface';

abstract class Loader {
	private readonly _configuration: LoaderConfiguration;

	constructor(configuration: LoaderConfiguration) {
		this._configuration = configuration;
	}

	public abstract execute(): Promise<void>;
}

export default Loader;
