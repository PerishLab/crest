import { execFileSync } from "node:child_process";
import {
	mkdirSync,
	mkdtempSync,
	readdirSync,
	rmSync,
	writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execPath } from "node:process";
import { expect, test } from "vitest";

test("the actual package loads through native Node from node_modules with usable types", () => {
	const root = mkdtempSync(join(tmpdir(), "crest-package-"));
	try {
		execFileSync("pnpm", ["pack", "--pack-destination", root], {
			stdio: "pipe",
		});
		const archive = readdirSync(root).find((name) => name.endsWith(".tgz"));
		expect(archive).toBeDefined();
		const seat = join(root, "node_modules/@perishlab/crest");
		mkdirSync(seat, { recursive: true });
		execFileSync("tar", [
			"-xzf",
			join(root, archive ?? ""),
			"-C",
			seat,
			"--strip-components=1",
		]);
		const source = String.raw`
import { read, asset, requests } from "@perishlab/crest/assets";
import { readFile, access } from "node:fs/promises";
const declaration = new URL("./assets.d.ts", import.meta.resolve("@perishlab/crest/assets"));
const types = await readFile(declaration, "utf8");
for (const match of types.matchAll(/from "(\.\/?[^"\n]+)"/g)) await access(new URL(match[1], declaration));
const manifest = read((await import("@perishlab/crest/media/manifest.json", { with: { type: "json" } })).default);
if(manifest.model.digest !== "sha256:55dfea2cd24096b94d74aee29bddf29a8f106084bc8d95b2c129b4d0a8eae0bf") throw new Error("Model changed");
for (const request of requests()) asset(manifest, request);
const request = requests()[0];
for (const product of ["unknown", "__proto__"]) {
  let refused = false;
  try { asset(manifest, { ...request, product }); } catch { refused = true; }
  if (!refused) throw new Error("Unknown product accepted");
}
let refused = false;
try { asset(manifest, { ...request, step: "tight" }); } catch { refused = true; }
if (!refused) throw new Error("Unsupported tight accepted");
const corrupt = structuredClone(manifest);
corrupt.assets[0].file = "../outside.svg";
refused = false;
try { read(corrupt); } catch { refused = true; }
if (!refused) throw new Error("Corrupt manifest accepted");
console.log(requests().length);
`;
		writeFileSync(join(root, "package.json"), '{"type":"module"}');
		writeFileSync(join(root, "check.mjs"), source);
		expect(
			execFileSync(execPath, [join(root, "check.mjs")], {
				encoding: "utf8",
			}).trim(),
		).toBe("120");
		expect(
			execFileSync(execPath, ["--conditions=source", join(root, "check.mjs")], {
				encoding: "utf8",
			}).trim(),
		).toBe("120");
		writeFileSync(
			join(root, "check.ts"),
			'import { asset, type Manifest, type Request } from "@perishlab/crest/assets";\nexport function select(manifest: Manifest, request: Request) { return asset(manifest, request); }\n',
		);
		execFileSync(
			"tsc",
			[
				"--noEmit",
				"--strict",
				"--module",
				"nodenext",
				"--moduleResolution",
				"nodenext",
				"--target",
				"es2024",
				"check.ts",
			],
			{ cwd: root, stdio: "pipe" },
		);
	} finally {
		rmSync(root, { recursive: true, force: true });
	}
}, 30000);
