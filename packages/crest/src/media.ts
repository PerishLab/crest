import { crest, frame, named, palette } from "./crest.ts";

export type Medium = "icon" | "touch" | "share";

export type Bearing = {
	height: number;
	medium: Medium;
	name: string;
	step: "full" | "tight";
	width: number;
};

export const media: Record<Medium, Omit<Bearing, "name">> = {
	icon: { height: 48, medium: "icon", step: "tight", width: 48 },
	touch: { height: 180, medium: "touch", step: "tight", width: 180 },
	share: { height: 630, medium: "share", step: "full", width: 1200 },
};

function icon(drawn: string): string {
	return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${frame} ${frame}" role="img" aria-label="${named["perish.code"].name}"><style>path{fill:${palette.ink}}@media(prefers-color-scheme:dark){path{fill:${palette.dark}}}</style>${drawn}</svg>`;
}

function touch(drawn: string): string {
	return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${frame} ${frame}" role="img" aria-label="${named["perish.code"].name}"><rect width="24" height="24" rx="5" fill="${palette.ink}"/><g fill="${palette.white}" transform="translate(3 3) scale(.75)">${drawn}</g></svg>`;
}

function share(name: string, drawn: string): string {
	return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" role="img" aria-label="${named[name]?.name ?? name}"><rect width="1200" height="630" fill="${palette.ground}"/><g fill="${palette.ink}" fill-rule="evenodd" transform="translate(420 135) scale(15)">${drawn}</g></svg>`;
}

export function bearing(name: string, medium: Medium): Bearing {
	return { ...media[medium], name };
}

export function vector(name: string, medium: Medium): string {
	const step = media[medium].step;
	const drawn = crest(name, step)
		.map((path) => `<path d="${path}"/>`)
		.join("");
	if (medium === "touch") return touch(drawn);
	if (medium === "share") return share(name, drawn);
	return icon(drawn);
}
