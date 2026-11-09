const outline =
	"M48 35C46 29 37 29 35 35C29 35 26 42 30 47C25 53 29 60 34 61C34 68 43 71 48 65Z";
const folds = "M35 36C34 43 43 41 42 47M32 52C40 48 43 55 37 60";

export function brain(ink: string): string {
	const paths = `<path d="${outline}"/><path d="${folds}"/>`;
	return `<g fill="none" stroke="${ink}" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round">${paths}<g transform="translate(100 0) scale(-1 1)">${paths}</g></g>`;
}
