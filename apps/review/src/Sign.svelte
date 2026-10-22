<script lang="ts">
import { crest, palette, type Step } from "@perishlab/crest/crest";

let {
	name,
	size,
	surface = "light",
	step = "full",
}: { name: string; size: number; surface?: string; step?: Step } = $props();
</script>

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size} role="img" aria-label={`${name} ${step}`} fill={surface === "dark" ? palette.dark : palette.ink} fill-rule="evenodd">
	{#each crest(name, step) as path (path)}
		<path d={path} />
	{/each}
</svg>
