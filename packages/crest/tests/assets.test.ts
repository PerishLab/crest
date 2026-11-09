import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import {
	asset,
	descriptor,
	type Request,
	read,
	requests,
} from "@perishlab/crest/assets";
import { palette } from "@perishlab/crest/crest";
import sharp from "sharp";
import { expect, test } from "vitest";

const root = process.cwd();
const query: Request = {
	product: "perish.code",
	form: "sign",
	step: "full",
	medium: "svg",
	surface: "light",
	size: 100,
};

async function manifest() {
	return read(
		JSON.parse(await readFile(join(root, "media/manifest.json"), "utf8")),
	);
}

async function image(product: string): Promise<Buffer> {
	const item = asset(await manifest(), { ...query, product });
	return readFile(join(root, item.file));
}

test("U22 preserves the approved shape when rendered in the official palette", async () => {
	const reference = await readFile(
		join(root, "tests/fixtures/u22.svg"),
		"utf8",
	);
	const expected = await sharp(
		Buffer.from(reference.replaceAll("#111111", palette.ink)),
	)
		.resize(400, 400)
		.raw()
		.toBuffer();
	const actual = await sharp(await image("perish.code"))
		.resize(400, 400)
		.raw()
		.toBuffer();
	expect(actual.equals(expected)).toBe(true);
});

test("only the Lab identity carries the brain, registered products receive the official shared base", async () => {
	const catalog = await manifest();
	expect(asset(catalog, query).kind).toBe("exact");
	expect(asset(catalog, { ...query, product: "design" }).kind).toBe("shared");
	const shared = await sharp(await image("design"))
		.raw()
		.toBuffer();
	for (const product of [
		"plumb",
		"concord",
		"noema",
		"stim",
		"ensign",
		"codehull",
		"plectron",
	]) {
		const bytes = await sharp(await image(product))
			.raw()
			.toBuffer();
		expect(bytes.equals(shared), product).toBe(true);
	}
	const lab = await sharp(await image("perish.code"))
		.raw()
		.toBuffer();
	expect(lab.equals(shared)).toBe(false);
});

test("packaged images match every declared selection, byte digest and actual raster dimensions", async () => {
	const catalog = await manifest();
	expect(catalog.assets).toHaveLength(108);
	for (const request of requests()) {
		const item = asset(catalog, request);
		const bytes = await readFile(join(root, item.file));
		expect(`sha256:${createHash("sha256").update(bytes).digest("hex")}`).toBe(
			item.digest,
		);
		const metadata = await sharp(bytes).metadata();
		expect(metadata.width).toBe(item.width);
		expect(metadata.height).toBe(item.height);
		expect(metadata.format).toBe(item.medium);
	}
});

test("unknown products and unsupported forms, steps, surfaces, media and sizes never fall back", async () => {
	const catalog = await manifest();
	const refused = [
		{ product: "unknown" },
		{ form: "wordtype" },
		{ step: "tight" },
		{ surface: "random" },
		{ medium: "jpeg" },
		{ medium: "__proto__" },
		{ size: 16 },
		{ medium: "png", size: 100 },
	];
	for (const change of refused) {
		expect(() => asset(catalog, { ...query, ...change } as Request)).toThrow(
			/Unknown|Unsupported/,
		);
	}
});

test("the manifest refuses unknown schemas, missing or duplicate entries, forged selections and unsafe files", async () => {
	const catalog = await manifest();
	const refused = [
		{ ...catalog, schema: "crest.assets/v2" },
		{ ...catalog, model: { ...catalog.model, digest: "stable" } },
		{ ...catalog, assets: catalog.assets.slice(1) },
		{ ...catalog, assets: [...catalog.assets, catalog.assets[0]] },
	];
	for (const value of refused) expect(() => read(value)).toThrow();
	for (const change of [
		{ file: "../outside.svg" },
		{ width: 16 },
		{ kind: "shared" },
		{ digest: "missing" },
	]) {
		const value = structuredClone(catalog);
		Object.assign(value.assets[0], change);
		expect(() => read(value)).toThrow();
	}
	expect(() => descriptor({ ...query, product: "__proto__" })).toThrow();
});

test("rasterization faithfully and repeatably materializes each shipped SVG", async () => {
	const catalog = await manifest();
	for (const request of requests().filter((item) => item.medium === "png")) {
		const svg = asset(catalog, { ...request, medium: "svg", size: 100 });
		const original = await readFile(join(root, svg.file));
		const expected = await sharp(original)
			.resize(request.size, request.size)
			.png()
			.toBuffer();
		const bytes = await readFile(join(root, asset(catalog, request).file));
		expect(bytes.equals(expected)).toBe(true);
	}
});
