<script lang="ts">
let { paths, size = 112 }: { paths: string[]; size?: number } = $props();
</script>

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width={size} height={size} aria-hidden="true" fill="currentColor" fill-rule="evenodd">
  {#each paths as path (path)}
    <path d={path} />
  {/each}
</svg>
