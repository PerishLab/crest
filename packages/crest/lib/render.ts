import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";
import { named } from "../src/crest.ts";
import { media, vector } from "../src/media.ts";

const output = join(process.cwd(), "media");

await mkdir(output, { recursive: true });
await writeFile(
	join(output, "favicon.svg"),
	`${vector("perish.code", "icon")}\n`,
);
await sharp(Buffer.from(vector("perish.code", "icon")))
	.resize(media.icon.width, media.icon.height)
	.png()
	.toFile(join(output, "favicon-48.png"));
await sharp(Buffer.from(vector("perish.code", "touch")))
	.resize(media.touch.width, media.touch.height)
	.png()
	.toFile(join(output, "apple-touch-icon.png"));

for (const name of Object.keys(named)) {
	const slug = name.replace(".", "-");
	await sharp(Buffer.from(vector(name, "share")))
		.resize(media.share.width, media.share.height)
		.png()
		.toFile(join(output, `og-${slug}.png`));
}
