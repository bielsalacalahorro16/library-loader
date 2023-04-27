import ScriptLoaderType from '../enums/script-loader-type.enum';

export default class DOMHelper {
	private static isLoadedInDOM(url: string, isScript: boolean): boolean {
		const selector: string = isScript
			? `script[src*='${url}']`
			: `link[href*='${url}']`;
		return document.querySelectorAll(selector).length >= 1;
	}

	public static loadScript(
		url: string,
		scriptLoaderType: ScriptLoaderType
	): Promise<HTMLScriptElement> {
		return new Promise((resolve, reject) => {
			if (!this.isLoadedInDOM(url, true)) {
				const script: HTMLScriptElement = document.createElement('script');
				script.setAttribute('src', url);
				script.onload = () => resolve(script);
				script.onerror = () => reject();
				scriptLoaderType === ScriptLoaderType.BodyContent
					? document.body.appendChild(script)
					: document.head.appendChild(script);
			}
		});
	}

	public static loadInlineStyle(styleText: string): Promise<HTMLStyleElement> {
		return new Promise((resolve, reject) => {
			const style: HTMLStyleElement = document.createElement('style');
			style.textContent = styleText;
			document.head.append(style);
			style.onload = () => resolve(style);
			style.onerror = () => reject();
		});
	}

	public static loadHeaderStyle(url: string): Promise<HTMLLinkElement> {
		return new Promise((resolve, reject) => {
			if (!this.isLoadedInDOM(url, false)) {
				const head: HTMLHeadElement = document.head;
				const link: HTMLLinkElement = document.createElement('link');
				link.type = 'text/css';
				link.rel = 'stylesheet';
				link.href = url;
				link.onload = () => resolve(link);
				link.onerror = () => reject();
				head.appendChild(link);
			}
		});
	}
}
