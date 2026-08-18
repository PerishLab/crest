import { expect, test } from "vitest";
import { base, clear, crest, hold, marks, named } from "../src/crest.ts";

function moves(paths: string[]): number {
	return paths.join(" ").split(/[A-Za-z]/).length - 1;
}

test("every product answers with the whole base and nothing of its own base", () => {
	const torn: string[] = [];
	for (const name of Object.keys(marks)) {
		const drawn = crest(name);
		for (const one of base.full) if (!drawn.includes(one)) torn.push(name);
	}
	expect(torn).toEqual([]);
});

test("a product adds at most one mark to the base it shares", () => {
	const loud = Object.entries(marks)
		.filter(([, paths]) => paths.length > 1)
		.map(([name]) => name);
	expect(loud).toEqual([]);
});

test("the tight step is drawn, never scaled down from the full one", () => {
	expect(base.tight).not.toEqual(base.full);
	expect(moves(base.tight)).toBeLessThan(moves(base.full));
});

test("no product varies the tight step, because a mark that small is the domain", () => {
	const drawn = Object.keys(marks).map((name) => crest(name, "tight").join());
	expect(new Set(drawn).size).toBe(1);
});

test("every product the marks know is a product the names know", () => {
	expect(Object.keys(marks).sort()).toEqual(Object.keys(named).sort());
});

test("the hold leaves the mark room the clear space respects", () => {
	expect(hold.near).toBeGreaterThan(clear);
	expect(hold.far).toBeLessThan(24 - clear);
});
