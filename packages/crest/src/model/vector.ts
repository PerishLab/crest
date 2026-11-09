import { palette } from "../crest.ts";
import { base, frame } from "./base.ts";
import { brain } from "./brain.ts";
import { catalog, product, type Surface, surfaces } from "./catalog.ts";

export function vector(name: string, surface: Surface): string {
	const key = product(name);
	if (!surfaces.includes(surface))
		throw new Error(`Unsupported Crest surface: ${surface}`);
	const inks = {
		light: palette.ink,
		dark: palette.dark,
		reverse: palette.white,
	};
	const ink = inks[surface];
	const mark = catalog[key] === "exact" ? brain(ink) : "";
	return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${frame} ${frame}" width="${frame}" height="${frame}" role="img" aria-label="${key}"><title>${key} · U22 ${catalog[key]}</title><g fill="${ink}">${base()}</g>${mark}</svg>`;
}
