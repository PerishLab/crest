import { mount } from "svelte";
import App from "./App.svelte";

const target = document.getElementById("app");
if (target === null) throw new Error("Review mount is missing");
mount(App, { target, props: { source: target.title } });
