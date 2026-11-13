<script lang="ts">
import Shape from "./Shape.svelte";
import { studies as first } from "./studies/first";
import { studies } from "./studies/second";

const originals = new Map(
	first.flatMap((group) => group.shapes).map((shape) => [shape.id, shape]),
);
</script>

<section class="iteration" aria-label="第二轮形状探索">
  {#each studies as group (group.id)}
    <section class="series" aria-label={`从 ${group.id} 继续`}>
      <h2>{group.id}<span>{group.note}</span></h2>
      <div class="variants">
        <figure class="original">
          <Shape paths={originals.get(group.id)?.paths ?? []} />
          <figcaption>{group.id}<span>原稿</span></figcaption>
        </figure>
        {#each group.shapes as shape (shape.id)}
          <figure id={shape.id}>
            <a href={`#${shape.id}`} aria-label={`候选 ${shape.id}`}><Shape paths={shape.paths} /></a>
            <figcaption>{shape.id}</figcaption>
          </figure>
        {/each}
      </div>
    </section>
  {/each}
  <p>可以选整枚，也可以选一个局部。旧稿仍然可以胜出。</p>
</section>

<style lang="less">
.iteration {
  margin: 48px 0 56px;
  color: #111;
}
.series {
  margin-bottom: 36px;
}
h2 {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 16px;
  margin: 0 0 12px;
  font: 500 13px/1.4 ui-monospace, monospace;
}
h2 span {
  color: #666;
  font: 12px/1.4 ui-sans-serif, system-ui, sans-serif;
}
.variants {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 1px;
  border: 1px solid #e5e5e5;
  background: #e5e5e5;
}
figure {
  margin: 0;
  padding: 30px 4px 20px;
  background: #fff;
  text-align: center;
  scroll-margin: 28px;
}
.original {
  background: #f0f0f0;
}
figcaption {
  margin-top: 24px;
  color: #555;
  opacity: 1;
  font: 11px/1 ui-monospace, monospace;
}
figcaption span {
  margin-left: 8px;
  font-family: ui-sans-serif, system-ui, sans-serif;
}
a {
  display: inline-block;
  color: inherit;
}
a:focus-visible {
  outline: 2px solid #111;
  outline-offset: 4px;
}
figure:target {
  outline: 2px solid #111;
  outline-offset: -2px;
}
p {
  color: #555;
  font-size: 13px;
}
@media (max-width: 1000px) {
  .variants {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
@media (max-width: 600px) {
  .variants {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
