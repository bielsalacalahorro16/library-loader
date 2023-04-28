import ScriptLoaderType from '../enums/script-loader-type.enum';

export default class DOMHelper {
	public static isLoadedInDOM(url: string, isScript: boolean): boolean {
		const selector: string = isScript
			? `script[src*='${url}']`
			: `link[href*='${url}']`;
		return document.querySelectorAll(selector).length >= 1;
	}

	public static loadScript(
		url: string,
		scriptLoaderType: ScriptLoaderType
	): Promise<void> {
		const script: HTMLScriptElement = document.createElement('script');
		scriptLoaderType === ScriptLoaderType.BodyContent
			? document.body.appendChild(script)
			: document.head.appendChild(script);
		script.setAttribute('src', url);
		return new Promise((resolve, reject) => {
			script.onload = (): void => resolve();
			script.onerror = (): void => reject();
		});
	}

	public static loadInlineStyle(styleText: string): Promise<void> {
		const style: HTMLStyleElement = document.createElement('style');
		document.head.append(style);
		style.textContent = styleText;
		return new Promise((resolve, reject) => {
			style.onload = (): void => resolve();
			style.onerror = (): void => reject();
		});
	}

	public static loadHeaderStyle(url: string): Promise<void> {
		const head: HTMLHeadElement = document.head;
		const link: HTMLLinkElement = document.createElement('link');
		head.appendChild(link);
		link.type = 'text/css';
		link.rel = 'stylesheet';
		link.href = url;
		return new Promise((resolve, reject) => {
			link.onload = (): void => resolve();
			link.onerror = (): void => reject();
		});
	}
}
