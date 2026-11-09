export const frame = 100;

export function base(): string {
	let inset = 10;
	return Array.from({ length: 2 }, (_, index) => {
		const size = frame - 2 * inset;
		const width = index === 0 ? 3.2 : 3.2 * 0.9;
		const long = ((size - 4) * 8) / 13;
		const short = ((size - 4) * 5) / 13;
		const path = `M0 ${size - long}H${width}V${size - width}H${short}V${size}H0Z`;
		const parts = Array.from(
			{ length: 4 },
			(_, corner) =>
				`<path d="${path}" transform="rotate(${-90 * corner} ${size / 2} ${size / 2})"/>`,
		).join("");
		const reflection = index === 1 ? ` translate(${size} 0) scale(-1 1)` : "";
		const group = `<g transform="translate(${inset} ${inset})${reflection}">${parts}</g>`;
		inset += width + 3.2 * 0.9;
		return group;
	}).join("");
}
