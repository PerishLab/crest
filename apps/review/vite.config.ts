import { vector } from "@perishlab/crest/media";
import { svelte, vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { defineConfig, loadEnv, type Plugin } from "vite";

import * as source from "./source.ts";

function review(): Plugin {
	const plugin: Plugin = { name: "crest" };
	const identity = source.observe(source.root);
	const label = identity
		? `${identity.commit} · 本地开发工作区`
		: "源码状态未知 · 本地开发工作区";
	plugin.transformIndexHtml = (html) => html.replace("@@SOURCE@@", label);
	plugin.configureServer = (server) => {
		server.middlewares.use("/favicon.svg", (_request, response) => {
			response.setHeader("Content-Type", "image/svg+xml");
			response.end(vector("perish.code", "icon"));
		});
	};
	return plugin;
}

export default defineConfig(({ command, mode }) => ({
	root: source.app,
	plugins: [
		command === "serve" && review(),
		svelte({ configFile: false, preprocess: vitePreprocess() }),
	],
	server: {
		host: "127.0.0.1",
		strictPort: true,
		port: Number(loadEnv(mode, source.app, "CREST_").CREST_PORT ?? 5173),
	},
	ssr: { noExternal: true },
}));
