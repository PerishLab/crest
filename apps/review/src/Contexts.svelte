<script lang="ts">
import Sign from "./Sign.svelte";
</script>

<section class="contexts">
	<h2>应用场景模拟</h2>
	<div class="grid">
		<article class="context">
			<h3>浏览器标签</h3>
			<div class="tab"><Sign name="perish.code" size={16} step="tight" /><span>perish.code</span></div>
		</article>
		<article class="context">
			<h3>站点导航</h3>
			<div class="navigation"><Sign name="design" size={24} /><span>Design</span><span class="muted">Why · What · How</span></div>
		</article>
		<article class="context">
			<h3>分享卡片</h3>
			<div class="share"><Sign name="perish.code" size={96} /><span>perish.code</span></div>
		</article>
	</div>
	<p class="muted">模拟场景仅用于观察尺寸与辨识度，不代表正式采用</p>
</section>
