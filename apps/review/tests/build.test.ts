import assert from "node:assert/strict";
import { mkdtemp, readdir, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { crest } from "@perishlab/crest/crest";
import { vector } from "@perishlab/crest/media";
import { build } from "crest-review/build";

test("build carries baseline geometry, actual sizes and truthful draft identity", async () => {
	const directory = await mkdtemp(join(tmpdir(), "crest-review-"));
	try {
		const identity = await build(directory);
		assert.equal(identity.private, true);
		const page = await readFile(join(directory, "index.html"), "utf8");
		assert.ok(identity.commit);
		assert.match(identity.commit, /^[a-f0-9]{40}$/);
		const label = `${identity.commit} · ${identity.dirty ? "工作区有未提交修改" : "已提交工作区"}`;
		assert.ok(page.includes(`title="${label}"`));
		assert.ok(page.includes(`class="source">${label}</p>`));
		assert.match(page, /品牌设计草稿 · 用于公开评审 · 不代表品牌采用/);
		assert.match(page, /B0-full/);
		assert.match(page, /B0-tight/);
		assert.doesNotMatch(page, /三十个形状候选|候选 A01|id="A01"|先看形状/);
		for (const size of [16, 24, 32])
			assert.ok(page.includes(`width="${size}" height="${size}"`));
		for (const path of crest("design")) assert.ok(page.includes(`d="${path}"`));
		assert.doesNotMatch(page, /@@|<script|<iframe|https?:\/\/(?!www\.w3\.org)/);
		assert.equal(
			await readFile(join(directory, "favicon.svg"), "utf8"),
			vector("perish.code", "icon"),
		);
		const css = await readFile(join(directory, "style.css"), "utf8");
		assert.match(css, /#536779/);
		assert.doesNotMatch(css, /@muted|@paper|:global/);
		assert.deepEqual((await readdir(directory)).sort(), [
			"favicon.svg",
			"index.html",
			"style.css",
		]);
	} finally {
		await rm(directory, { recursive: true });
	}
});
