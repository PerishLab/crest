<script lang="ts">
import { named } from "@perishlab/crest/crest";
import Sign from "./Sign.svelte";

let { surface }: { surface: string } = $props();
const sizes = [16, 24, 32];
</script>

<section class={`surface ${surface}`}>
	<h2>{surface === "dark" ? "深色底" : "浅色底"} · B0-full</h2>
	<div class="grid">
		{#each Object.keys(named) as name (name)}
			<article class="specimen">
				<h3>{name}</h3>
				<div class="sizes">
					{#each sizes as size (size)}
						<figure><Sign {name} {size} {surface} /><figcaption>{size}px</figcaption></figure>
					{/each}
				</div>
			</article>
		{/each}
	</div>
	<div class="tight">
		<span>B0-tight · 域级 favicon</span>
		{#each sizes as size (size)}
			<Sign name="perish.code" {size} {surface} step="tight" />
		{/each}
	</div>
</section>
