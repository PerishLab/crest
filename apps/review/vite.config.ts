import { execFileSync } from "node:child_process";
import { vector } from "@perishlab/crest/media";
import { svelte, vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { defineConfig, loadEnv, type Plugin } from "vite";

function favicon(): Plugin {
	const plugin: Plugin = { name: "crest" };
	plugin.transformIndexHtml = (html) =>
		html.replace("@@SOURCE@@", `${commit} · 本地开发工作区`);
	plugin.configureServer = (server) => {
		server.middlewares.use("/favicon.svg", (_request, response) => {
			response.setHeader("Content-Type", "image/svg+xml");
			response.end(vector("perish.code", "icon"));
		});
	};
	return plugin;
}

const commit = execFileSync("git", ["rev-parse", "HEAD"], {
	encoding: "utf8",
}).trim();

export default defineConfig(({ mode }) => ({
	plugins: [
		favicon(),
		svelte({ configFile: false, preprocess: vitePreprocess() }),
	],
	server: {
		host: "127.0.0.1",
		strictPort: true,
		port: Number(loadEnv(mode, process.cwd(), "CREST_").CREST_PORT ?? 5173),
	},
	ssr: { noExternal: true },
}));
