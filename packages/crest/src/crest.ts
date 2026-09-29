export const frame = 24;

export const hold = { near: 6.6, far: 17.4 };

export const clear = 3;

export const ink = "#2f679c";

export const palette = {
	dark: "#8fc7f2",
	ground: "#f3f6f9",
	ink,
	white: "#ffffff",
};

export const base = {
	full: ["M12 1L23 12 12 23 1 12zM12 5.2L5.2 12 12 18.8 18.8 12z"],
	tight: ["M12 1.5L22.5 12 12 22.5 1.5 12z"],
};

export const marks: Record<string, string[]> = {
	"perish.code": [],
	design: ["M12 6.8L17.2 12 12 17.2 6.8 12z"],
	plumb: ["M8.8 8h6.4v2.6h-1.9V16h-2.6v-5.4H8.8z"],
	concord: ["M12 7.8a4.2 4.2 0 100 8.4 4.2 4.2 0 000-8.4z"],
};

export const named: Record<string, { owner?: string; name: string }> = {
	"perish.code": { name: "perish.code" },
	design: { owner: "@perishlab/", name: "design" },
	plumb: { name: "plumb" },
	concord: { name: "concord" },
};

export type Step = "full" | "tight";

export function crest(name: string, step: Step = "full"): string[] {
	if (step === "tight") return base.tight;
	return [...base.full, ...(marks[name] ?? [])];
}
