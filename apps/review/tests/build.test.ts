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
		assert.match(identity.commit, /^[a-f0-9]{40}$/);
		assert.ok(page.includes(identity.commit));
		assert.match(page, /尚未批准公开/);
		assert.match(page, /B0-full/);
		assert.match(page, /B0-tight/);
		for (const size of [16, 24, 32])
			assert.ok(page.includes(`width="${size}" height="${size}"`));
		for (const path of crest("design")) assert.ok(page.includes(`d="${path}"`));
		assert.doesNotMatch(page, /@@|<script|<iframe|https?:\/\/(?!www\.w3\.org)/);
		assert.equal(
			await readFile(join(directory, "favicon.svg"), "utf8"),
			vector("perish.code", "icon"),
		);
		assert.deepEqual((await readdir(directory)).sort(), [
			"favicon.svg",
			"index.html",
			"style.css",
		]);
	} finally {
		await rm(directory, { recursive: true });
	}
});
