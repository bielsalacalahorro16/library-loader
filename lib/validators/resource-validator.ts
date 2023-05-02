export class ResourceValidator {
	public static validate(url: string) {
		if (url === '') throw new Error("The url can't be empty");
	}
}
