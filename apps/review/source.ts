import { execFileSync } from "node:child_process";
import { realpathSync } from "node:fs";
import { devNull } from "node:os";
import { resolve } from "node:path";

export interface Identity {
	commit: string;
	tree: string;
}

export const app = import.meta.dirname;
export const root = resolve(app, "../..");

const digest = /^[0-9a-f]{40}$/;

function valid(value: unknown): value is string {
	return typeof value === "string" && digest.test(value);
}

export function observe(root: string) {
	try {
		const directory = realpathSync(root);
		const git = (...args: string[]) =>
			execFileSync("git", ["-c", "core.fsmonitor=false", ...args], {
				cwd: directory,
				env: {
					PATH: process.env.PATH,
					SystemRoot: process.env.SystemRoot,
					GIT_CONFIG_GLOBAL: devNull,
					GIT_CONFIG_NOSYSTEM: "1",
					GIT_NO_REPLACE_OBJECTS: "1",
					GIT_NO_LAZY_FETCH: "1",
					GIT_OPTIONAL_LOCKS: "0",
					GIT_TERMINAL_PROMPT: "0",
					LC_ALL: "C",
				},
				encoding: "utf8",
				stdio: ["ignore", "pipe", "pipe"],
				timeout: 5000,
			});
		const lines = git("rev-parse", "--show-toplevel", "HEAD", "HEAD^{tree}")
			.slice(0, -1)
			.split("\n");
		const tree = lines.pop();
		const commit = lines.pop();
		if (!valid(commit) || !valid(tree) || lines.join("\n") !== directory) {
			return null;
		}
		const dirty = Boolean(
			git(
				"status",
				"--porcelain",
				"--untracked-files=normal",
				"--ignore-submodules=none",
			),
		);
		return { commit, tree, dirty };
	} catch {
		return null;
	}
}

export function parse(input: string): Identity {
	const value: unknown = JSON.parse(input);
	if (
		typeof value !== "object" ||
		value === null ||
		Object.keys(value).length !== 2
	) {
		throw new Error("--source requires a commit and tree object");
	}
	const { commit, tree } = value as Partial<Identity>;
	if (!valid(commit) || !valid(tree)) {
		throw new Error("--source requires full commit and tree IDs");
	}
	return { commit, tree };
}

export function validate(root: string, expected?: Identity) {
	const observed = observe(root);
	if (expected === undefined) return observed;
	if (!observed || observed.dirty) {
		throw new Error("--source requires an observable clean review checkout");
	}
	if (observed.commit !== expected.commit || observed.tree !== expected.tree) {
		throw new Error("--source does not match the review checkout");
	}
	return observed;
}
