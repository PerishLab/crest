import { render } from "svelte/server";
import App from "./App.svelte";

export function page(source: string) {
	return render(App, { props: { source } }).body;
}
