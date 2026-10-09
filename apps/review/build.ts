import { execFileSync } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { crest, named, palette, type Step } from "@perishlab/crest/crest";
import { vector } from "@perishlab/crest/media";

const root = resolve(process.cwd(), "../..");

function sign(
	name: string,
	size: number,
	surface: string,
	step: Step = "full",
) {
	const colour = surface === "dark" ? palette.dark : palette.ink;
	const paths = crest(name, step)
		.map((path) => `<path d="${path}"/>`)
		.join("");
	return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${size}" height="${size}" role="img" aria-label="${name} ${step}" fill="${colour}" fill-rule="evenodd">${paths}</svg>`;
}

function specimens(surface: string) {
	const rows = Object.keys(named).map((name) => {
		const sizes = [16, 24, 32]
			.map(
				(size) =>
					`<figure>${sign(name, size, surface)}<figcaption>${size}px</figcaption></figure>`,
			)
			.join("");
		return `<article class="specimen"><h3>${name}</h3><div class="sizes">${sizes}</div></article>`;
	});
	return `<section class="surface ${surface}"><h2>${surface === "dark" ? "深色底" : "浅色底"} · B0-full</h2><div class="grid">${rows.join("")}</div><div class="tight"><span>B0-tight · 域级 favicon</span>${[16, 24, 32].map((size) => sign("perish.code", size, surface, "tight")).join("")}</div></section>`;
}

function contexts() {
	return `<section class="contexts"><h2>应用场景模拟</h2><div class="grid"><article class="context"><h3>浏览器标签</h3><div class="tab">${sign("perish.code", 16, "light", "tight")}<span>perish.code</span></div></article><article class="context"><h3>站点导航</h3><div class="navigation">${sign("design", 24, "light")}<span>Design</span><span class="muted">Why · What · How</span></div></article><article class="context"><h3>分享卡片</h3><div class="share">${sign("perish.code", 96, "light")}<span>perish.code</span></div></article></div><p class="muted">模拟场景仅用于观察尺寸与辨识度，不代表正式采用</p></section>`;
}

export async function build(destination: string) {
	const commit = execFileSync("git", ["rev-parse", "HEAD"], {
		cwd: root,
		encoding: "utf8",
	}).trim();
	const changed = execFileSync(
		"git",
		["status", "--porcelain", "--untracked-files=normal"],
		{ cwd: root, encoding: "utf8" },
	).trim();
	const state = changed ? "工作区有未提交修改" : "已提交工作区";
	const template = await readFile(
		join(process.cwd(), "src/index.html"),
		"utf8",
	);
	const app = JSON.parse(
		await readFile(join(process.cwd(), "package.json"), "utf8"),
	);
	if (app.private !== true)
		throw new Error("Review applications must stay private");
	const page = template
		.replace("@@SOURCE@@", `${commit} · ${state}`)
		.replace("@@SPECIMENS@@", specimens("light") + specimens("dark"))
		.replace("@@CONTEXTS@@", contexts());
	await mkdir(destination, { recursive: true });
	await writeFile(join(destination, "index.html"), page);
	await writeFile(
		join(destination, "favicon.svg"),
		vector("perish.code", "icon"),
	);
	await writeFile(
		join(destination, "style.css"),
		await readFile(join(process.cwd(), "src/style.css")),
	);
	return { commit, dirty: Boolean(changed), private: app.private };
}

if (process.argv[1] === join(process.cwd(), "build.ts")) {
	await build(join(process.cwd(), "dist"));
}
