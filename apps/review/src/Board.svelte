<script lang="ts">
import Shape from "./Shape.svelte";
import { studies } from "./studies/first";
</script>

<section class="board" aria-label="第一批三十个形状候选">
  {#each studies as group (group.id)}
    <section class="series" aria-label={`组 ${group.id}`}>
      <h2>{group.id}<span>01 — 05</span></h2>
      <div class="shapes">
        {#each group.shapes as shape (shape.id)}
          <figure id={shape.id}>
            <a href={`#${shape.id}`} aria-label={`候选 ${shape.id}`}><Shape paths={shape.paths} /></a>
            <figcaption>{shape.id}</figcaption>
          </figure>
        {/each}
      </div>
    </section>
  {/each}
  <p class="choose">留下几个编号就好，例如 A02、C04、F01。也可以只说喜欢其中的某个局部。</p>
</section>

<style lang="less">
.board {
  color: #111;
  margin: 48px 0 72px;
}
.series {
  margin: 0 0 36px;
}
h2 {
  display: flex;
  gap: 16px;
  align-items: baseline;
  margin: 0 0 12px;
  font: 500 13px/1.4 ui-monospace, monospace;
}
h2 span {
  color: #777;
  font-size: 10px;
  font-weight: 400;
}
.shapes {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 1px;
  background: #e5e5e5;
  border: 1px solid #e5e5e5;
}
figure {
  background: #fff;
  padding: 30px 8px 18px;
  margin: 0;
  text-align: center;
  scroll-margin: 28px;
}
figure:target {
  outline: 2px solid #111;
  outline-offset: -2px;
}
a {
  color: inherit;
  display: inline-block;
}
a:focus-visible {
  outline: 2px solid #111;
  outline-offset: 6px;
}
figcaption {
  margin-top: 24px;
  color: #555;
  font: 11px/1 ui-monospace, monospace;
  opacity: 1;
}
.choose {
  margin-top: 28px;
  font-size: 13px;
  color: #555;
}
@media (max-width: 720px) {
  .shapes {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
