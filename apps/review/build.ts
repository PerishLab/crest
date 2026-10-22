import { execFileSync } from "node:child_process";
import { readFile, rm, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { vector } from "@perishlab/crest/media";
import { build as bundle } from "vite";

export async function build(destination: string) {
	const commit = execFileSync("git", ["rev-parse", "HEAD"], {
		encoding: "utf8",
	}).trim();
	const changed = execFileSync(
		"git",
		["status", "--porcelain", "--untracked-files=normal"],
		{ encoding: "utf8" },
	).trim();
	const app = JSON.parse(await readFile("package.json", "utf8"));
	if (app.private !== true)
		throw new Error("Review applications must stay private");
	await bundle({
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
	const source = `${commit} · ${changed ? "工作区有未提交修改" : "已提交工作区"}`;
	const template = await readFile("index.html", "utf8");
	const page = template
		.replace("@@SOURCE@@", source)
		.replace("</div>", `${rendered.page(source)}</div>`)
		.replace('<script type="module" src="/src/main.ts"></script>', "")
		.replace("</head>", '<link rel="stylesheet" href="./style.css"></head>');
	await writeFile(join(destination, "index.html"), page);
	await writeFile(
		join(destination, "favicon.svg"),
		vector("perish.code", "icon"),
	);
	await rm(join(destination, "render.mjs"));
	return { commit, dirty: Boolean(changed), private: app.private };
}

if (process.argv[1] === resolve("build.ts")) await build(resolve("dist"));
