import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { bearing, media, vector } from "@perishlab/crest/media";
import sharp from "sharp";
import { expect, test } from "vitest";

const assets = join(process.cwd(), "media");

test("every medium declares a square or sharing frame", () => {
	expect(media.icon).toMatchObject({ width: 48, height: 48, step: "tight" });
	expect(media.touch).toMatchObject({ width: 180, height: 180, step: "tight" });
	expect(media.share).toMatchObject({ width: 1200, height: 630, step: "full" });
});

test("browser icons use the one tight domain geometry", () => {
	expect(vector("design", "icon")).toBe(vector("perish.code", "icon"));
	expect(vector("design", "touch")).toBe(vector("perish.code", "touch"));
});

test("sharing media carries the product mark", () => {
	expect(vector("design", "share")).not.toBe(vector("plumb", "share"));
	expect(vector("design", "share")).toContain('viewBox="0 0 1200 630"');
	expect(bearing("design", "share")).toEqual({
		height: 630,
		medium: "share",
		name: "design",
		step: "full",
		width: 1200,
	});
});

test("published assets are exact materialisations of the vector contract", async () => {
	const favicon = await readFile(join(assets, "favicon.svg"), "utf8");
	expect(favicon).toBe(`${vector("perish.code", "icon")}\n`);

	const cases = [
		{ file: "favicon-48.png", medium: "icon", name: "perish.code" },
		{ file: "apple-touch-icon.png", medium: "touch", name: "perish.code" },
		{ file: "og-design.png", medium: "share", name: "design" },
	] as const;
	for (const item of cases) {
		const size = media[item.medium];
		const expected = await sharp(Buffer.from(vector(item.name, item.medium)))
			.resize(size.width, size.height)
			.png()
			.toBuffer();
		const actual = await readFile(join(assets, item.file));
		expect(actual.equals(expected), item.file).toBe(true);
	}
});
