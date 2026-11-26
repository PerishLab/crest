import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { devNull, tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import * as source from "../source.ts";

test("source identity is scoped to the exact checkout and checks cleanliness", async (context) => {
	const directory = await mkdtemp(join(tmpdir(), "crest-source-"));
	context.after(() => rm(directory, { recursive: true, force: true }));
	const root = join(directory, "source with spaces 雕刻\ncheckout");
	const other = join(directory, "other");
	const nested = join(root, "nested");
	await mkdir(nested, { recursive: true });
	await mkdir(other);

	const git = (cwd: string, ...args: string[]) =>
		execFileSync(
			"git",
			[
				"-c",
				`core.hooksPath=${devNull}`,
				"-c",
				"commit.gpgSign=false",
				"-c",
				"user.name=Crest Test",
				"-c",
				"user.email=crest@example.invalid",
				...args,
			],
			{
				cwd,
				env: {
					PATH: process.env.PATH,
					SystemRoot: process.env.SystemRoot,
					GIT_CONFIG_GLOBAL: devNull,
					GIT_CONFIG_NOSYSTEM: "1",
				},
				encoding: "utf8",
			},
		).trim();

	for (const checkout of [root, other]) {
		git(checkout, "init", "--quiet", "--object-format=sha1");
		await writeFile(join(checkout, "note"), checkout);
		git(checkout, "add", "note");
		git(checkout, "commit", "--quiet", "-m", "Fixture");
	}
	const expected = {
		commit: git(root, "rev-parse", "HEAD"),
		tree: git(root, "rev-parse", "HEAD^{tree}"),
	};

	const injected = {
		GIT_DIR: join(other, ".git"),
		GIT_WORK_TREE: other,
		GIT_INDEX_FILE: join(other, ".git", "index"),
		GIT_CONFIG_COUNT: "1",
		GIT_CONFIG_KEY_0: "status.showUntrackedFiles",
		GIT_CONFIG_VALUE_0: "no",
	};
	for (const [key, value] of Object.entries(injected)) {
		const previous = process.env[key];
		context.after(() => {
			if (previous === undefined) delete process.env[key];
			else process.env[key] = previous;
		});
		process.env[key] = value;
	}

	assert.equal(source.observe(directory), null);
	assert.equal(source.observe(nested), null);
	assert.deepEqual(
		source.validate(root, source.parse(JSON.stringify(expected))),
		{
			...expected,
			dirty: false,
		},
	);
	assert.throws(
		() =>
			source.validate(root, {
				...expected,
				commit: git(other, "rev-parse", "HEAD"),
			}),
		/does not match/,
	);
	assert.throws(
		() =>
			source.validate(root, {
				...expected,
				tree: git(other, "rev-parse", "HEAD^{tree}"),
			}),
		/does not match/,
	);
	assert.throws(() => source.validate(directory, expected), /observable clean/);
	assert.throws(
		() => source.parse('{"commit":"HEAD","tree":"HEAD"}'),
		/full commit and tree/,
	);

	await writeFile(join(root, "untracked"), "new");
	assert.deepEqual(source.observe(root), { ...expected, dirty: true });
	assert.throws(() => source.validate(root, expected), /observable clean/);
	await rm(join(root, "untracked"));
	await writeFile(join(root, "note"), "changed");
	assert.deepEqual(source.observe(root), { ...expected, dirty: true });
});
