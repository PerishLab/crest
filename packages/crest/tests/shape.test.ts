import { execFileSync } from "node:child_process";
import { expect, test } from "vitest";
import { base, hold, marks } from "../src/crest.ts";

function held(): string {
	return `(() => {
		const marks = ${JSON.stringify(marks)};
		const base = ${JSON.stringify(base)};
		const hold = ${JSON.stringify(hold)};
		const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		svg.setAttribute("viewBox", "0 0 24 24");
		svg.style.cssText = "position:absolute;width:240px;height:240px;visibility:hidden";
		document.body.appendChild(svg);
		const box = (paths) => {
			let x0 = 99, y0 = 99, x1 = -99, y1 = -99;
			for (const d of paths) {
				const p = document.createElementNS("http://www.w3.org/2000/svg", "path");
				p.setAttribute("d", d); svg.appendChild(p);
				const b = p.getBBox();
				x0 = Math.min(x0, b.x); y0 = Math.min(y0, b.y);
				x1 = Math.max(x1, b.x + b.width); y1 = Math.max(y1, b.y + b.height);
				p.remove();
			}
			return [x0, y0, x1, y1];
		};
		const out = [];
		for (const [name, paths] of Object.entries(marks)) {
			if (paths.length === 0) continue;
			const [x0, y0, x1, y1] = box(paths);
			if (x0 < hold.near || y0 < hold.near || x1 > hold.far || y1 > hold.far)
				out.push(name + " " + x0.toFixed(1) + "," + y0.toFixed(1) + " " + x1.toFixed(1) + "," + y1.toFixed(1));
		}
		for (const [step, paths] of Object.entries(base)) {
			const [x0, y0, x1, y1] = box(paths);
			const wide = Math.max(x1 - x0, y1 - y0);
			if (wide < 18 || x0 < 1 || y0 < 1 || x1 > 23 || y1 > 23) out.push(step + " " + wide.toFixed(1));
		}
		svg.remove();
		return JSON.stringify(out);
	})()`;
}

function proof(): string {
	return `(() => {
		const marks = ${JSON.stringify(marks)};
		const base = ${JSON.stringify(base)};
		const sizes = [16, 24, 32, 48, 64, 180];
		const products = Object.keys(marks);
		document.body.innerHTML = "";
		document.body.style.cssText = "margin:0;background:#dde4eb;font:14px ui-monospace;color:#17202b";
		const main = document.createElement("main");
		main.style.cssText = "display:grid;gap:24px;padding:32px";
		for (const ground of ["#f3f6f9", "#111820"]) {
			const section = document.createElement("section");
			section.style.cssText = "display:grid;grid-template-columns:repeat(6,1fr);gap:20px;padding:24px;border-radius:20px;background:" + ground;
			for (const size of sizes) {
				const cell = document.createElement("div");
				cell.style.cssText = "display:grid;align-content:start;justify-items:center;gap:14px;min-height:220px;color:" + (ground === "#111820" ? "#8fc7f2" : "#2f679c");
				const title = document.createElement("b"); title.textContent = size + "px"; cell.appendChild(title);
				for (const product of products) {
					const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
					svg.setAttribute("viewBox", "0 0 24 24"); svg.setAttribute("width", String(size)); svg.setAttribute("height", String(size));
					const paths = size === 16 ? base.tight : [...base.full, ...marks[product]];
					for (const d of paths) { const path = document.createElementNS("http://www.w3.org/2000/svg", "path"); path.setAttribute("d", d); svg.appendChild(path); }
					svg.style.cssText = "fill:currentColor;fill-rule:evenodd"; cell.appendChild(svg);
				}
				section.appendChild(cell);
			}
			main.appendChild(section);
		}
		document.body.appendChild(main);
		return document.documentElement.scrollHeight;
	})()`;
}

test.skipIf(process.env.LOOK !== "1")(
	"keeps every mark inside the hold and every base inside the frame",
	() => {
		execFileSync("playwright-cli", ["goto", "about:blank"], {
			stdio: "ignore",
		});
		const raw = execFileSync("playwright-cli", ["--raw", "eval", held()], {
			encoding: "utf8",
		});
		expect(JSON.parse(JSON.parse(raw.trim()))).toEqual([]);
		execFileSync("playwright-cli", ["--raw", "eval", proof()], {
			stdio: "ignore",
		});
		execFileSync(
			"playwright-cli",
			["screenshot", "--filename=/tmp/crest-proof.png", "--full-page"],
			{ stdio: "ignore" },
		);
	},
	60000,
);
