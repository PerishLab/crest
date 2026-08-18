import { createServer } from "vite";

const server = await createServer({
	root: process.cwd(),
	server: { middlewareMode: true },
});

try {
	await server.ssrLoadModule("/probe.js");
} finally {
	await server.close();
}
