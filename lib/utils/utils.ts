export function hasLength(array: any[]) {
	return Array.isArray(array) && array.length !== 0;
}

export function removeDuplicatesInArray(array: any[]): any[] {
	if (!hasLength(array)) {
		throw new Error('Array must contain elements');
	}
	const uniqueElements: Set<any> = new Set<any>(array.map((el) => el));
	return Array.from(uniqueElements.values());
}
