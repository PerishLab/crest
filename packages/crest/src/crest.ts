export const frame = 24;

export const hold = { near: 4.6, far: 19.4 };

export const clear = 3;

export const ink = "#33608f";

export const base = {
	full: ["M12 1.5L22.5 12 12 22.5 1.5 12zM12 4.6L4.6 12 12 19.4 19.4 12z"],
	tight: ["M12 2L22 12 12 22 2 12z"],
};

export const marks: Record<string, string[]> = {
	"perish.code": [],
	design: ["M12 7.5L16.5 12 12 16.5 7.5 12z"],
	plumb: ["M9.4 8.6h5.2v2.1h-1.6v4.7h-2v-4.7H9.4z"],
	concord: ["M12 8.2a3.8 3.8 0 100 7.6 3.8 3.8 0 000-7.6z"],
};

export const named: Record<string, { owner?: string; name: string }> = {
	"perish.code": { name: "perish.code" },
	design: { owner: "@perish/", name: "design" },
	plumb: { name: "plumb" },
	concord: { name: "concord" },
};

export type Step = "full" | "tight";

export function crest(name: string, step: Step = "full"): string[] {
	if (step === "tight") return base.tight;
	return [...base.full, ...(marks[name] ?? [])];
}
