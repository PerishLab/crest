export const catalog = {
	"perish.code": "exact",
	design: "shared",
	plumb: "shared",
	concord: "shared",
	noema: "shared",
	stim: "shared",
	ensign: "shared",
	codehull: "shared",
	plectron: "shared",
} as const;

export type Product = keyof typeof catalog;
export const surfaces = ["light", "dark", "reverse"] as const;
export type Surface = (typeof surfaces)[number];
export const sizes = [48, 96, 180] as const;

export function product(name: string): Product {
	if (!Object.hasOwn(catalog, name))
		throw new Error(`Unknown Crest product: ${name}`);
	return name as Product;
}
