import { render } from "svelte/server";
import Baseline from "./Baseline.svelte";

export function page(source: string) {
	return render(Baseline, { props: { source } }).body;
}
