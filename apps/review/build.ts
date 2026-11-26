import { readFile, rm, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { parseArgs } from "node:util";
import { vector } from "@perishlab/crest/media";
import { build as bundle } from "vite";

import * as source from "./source.ts";

export async function build(destination: string, expected?: source.Identity) {
	destination = resolve(destination);
	const identity = source.validate(source.root, expected);
	const app = JSON.parse(
		await readFile(join(source.app, "package.json"), "utf8"),
	);
	if (app.private !== true)
		throw new Error("Review applications must stay private");
	await bundle({
		root: source.app,
		configFile: join(source.app, "vite.config.ts"),
		build: {
			ssr: "src/render.ts",
			outDir: destination,
			emptyOutDir: true,
			ssrEmitAssets: true,
			cssCodeSplit: false,
			rollupOptions: {
				output: {
					entryFileNames: "render.mjs",
					assetFileNames: "[name][extname]",
				},
			},
		},
	});
	const rendered = await import(
		pathToFileURL(join(destination, "render.mjs")).href
	);
	if (expected) source.validate(source.root, expected);
	const label = identity
		? `${identity.commit} · ${identity.dirty ? "工作区有未提交修改" : "已提交工作区"}`
		: "源码状态未知";
	const template = await readFile(join(source.app, "index.html"), "utf8");
	const page = template
		.replace("@@SOURCE@@", label)
		.replace("</div>", `${rendered.page(label)}</div>`)
		.replace('<script type="module" src="/src/main.ts"></script>', "")
		.replace("</head>", '<link rel="stylesheet" href="./style.css"></head>');
	await writeFile(join(destination, "index.html"), page);
	await writeFile(
		join(destination, "favicon.svg"),
		vector("perish.code", "icon"),
	);
	await rm(join(destination, "render.mjs"));
	return {
		commit: identity?.commit ?? null,
		dirty: identity?.dirty ?? null,
		private: app.private,
	};
}

if (import.meta.main) {
	const { values } = parseArgs({ options: { source: { type: "string" } } });
	const expected =
		values.source === undefined ? undefined : source.parse(values.source);
	await build(join(source.app, "dist"), expected);
}
