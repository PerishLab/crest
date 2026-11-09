import { createHash } from "node:crypto";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import {
	type Asset,
	descriptor,
	type Manifest,
	read,
	requests,
} from "@perishlab/crest/assets";
import sharp from "sharp";
import { vector } from "../model/vector.ts";

function digest(bytes: string | Buffer): string {
	return `sha256:${createHash("sha256").update(bytes).digest("hex")}`;
}

async function model(): Promise<string> {
	const files = (await readdir(new URL("../model/", import.meta.url)))
		.filter((file) => file.endsWith(".ts"))
		.map((file) => `model/${file}`);
	files.push("crest.ts");
	const sources = await Promise.all(
		files.sort().map(async (file) => ({
			file,
			digest: digest(await readFile(new URL(`../${file}`, import.meta.url))),
		})),
	);
	return digest(JSON.stringify(sources));
}

export async function generate(output: string): Promise<Manifest> {
	const assets: Asset[] = [];
	for (const request of requests()) {
		const item = descriptor(request);
		const svg = `${vector(request.product, request.surface)}\n`;
		const bytes =
			request.medium === "svg"
				? Buffer.from(svg)
				: await sharp(Buffer.from(svg))
						.resize(request.size, request.size)
						.png()
						.toBuffer();
		const file = join(output, item.file.slice("media/".length));
		await mkdir(dirname(file), { recursive: true });
		await writeFile(file, bytes);
		assets.push({ ...item, digest: digest(bytes) });
	}
	const manifest = read({
		schema: "crest.assets/v1",
		model: { name: "u22", digest: await model() },
		assets,
	});
	await writeFile(
		join(output, "manifest.json"),
		`${JSON.stringify(manifest, null, 2)}\n`,
	);
	return manifest;
}
