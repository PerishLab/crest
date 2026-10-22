<script lang="ts">
import Contexts from "./Contexts.svelte";
import Surface from "./Surface.svelte";

let { source }: { source: string } = $props();
</script>

<main>
	<header>
		<p class="eyebrow">PERISHLAB / CREST REVIEW</p>
		<h1>先看清，再决定</h1>
		<p class="intro">B0 是现有 Crest 的基线，不是新提案<br />在真实尺寸和不同背景中观察它，为后续候选建立共同参照</p>
		<p class="notice">品牌设计草稿 · 用于公开评审 · 不代表品牌采用</p>
		<details><summary>来源与评审状态</summary><p class="source">{source}</p></details>
	</header>
	<Surface surface="light" />
	<Surface surface="dark" />
	<Contexts />
	<footer>本页展示现有品牌基线，候选与公开授权仍由对应 Issue 跟进</footer>
</main>

<style lang="less">
@muted: #536779;
@paper: #f3f6f9;
:global {
:root {
	font-family: ui-sans-serif, system-ui, sans-serif;
	color: #203247;
	background: #e9eef3;
	line-height: 1.6;
}
* {
	box-sizing: border-box;
}
body {
	margin: 0;
}
main {
	max-width: 1120px;
	margin: auto;
	padding: 64px 28px;
}
header {
	margin-bottom: 48px;
}
h1 {
	font-size: clamp(32px, 5vw, 56px);
	letter-spacing: -0.04em;
	line-height: 1.2;
	margin: 18px 0;
}
h2 {
	font-size: 18px;
	margin: 0 0 24px;
}
h3 {
	font-size: 14px;
	font-weight: 500;
	margin: 0;
}
p {
	margin: 12px 0;
}
.eyebrow {
	font-size: 12px;
	letter-spacing: 0.16em;
	color: @muted;
}
.intro {
	max-width: 640px;
	color: @muted;
}
.notice {
	font-size: 13px;
	border-left: 3px solid #2f679c;
	padding-left: 14px;
}
details {
	margin-top: 24px;
	font-size: 12px;
	color: @muted;
}
summary {
	cursor: pointer;
}
.source {
	overflow-wrap: anywhere;
	font-family: ui-monospace, monospace;
}
.surface {
	padding: 32px;
	margin: 24px 0;
	border-radius: 20px;
}
.light {
	background: @paper;
}
.dark {
	background: #14202e;
	color: #d6e3ee;
}
.grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
	gap: 28px;
}
.sizes {
	display: flex;
	align-items: baseline;
	gap: 28px;
	margin-top: 24px;
}
figure {
	margin: 0;
	text-align: center;
}
svg {
	flex: none;
	display: inline-block;
	vertical-align: middle;
}
figcaption {
	font-size: 11px;
	opacity: 0.65;
	margin-top: 12px;
}
.tight {
	display: flex;
	align-items: center;
	flex-wrap: wrap;
	gap: 24px;
	border-top: 1px solid #73889d40;
	margin-top: 32px;
	padding-top: 24px;
	font-size: 12px;
}
.tight span {
	margin-right: auto;
}
.contexts {
	margin-top: 48px;
}
.context {
	min-width: 0;
}
.tab,
.navigation {
	display: flex;
	align-items: center;
	gap: 10px;
	margin-top: 18px;
	padding: 16px;
	background: @paper;
	border-radius: 12px;
	font-size: 13px;
}
.navigation {
	flex-wrap: wrap;
}
.share {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 16px;
	aspect-ratio: 1200 / 630;
	margin-top: 18px;
	border-radius: 12px;
	background: @paper;
}
.muted {
	color: @muted;
	font-size: 12px;
}
footer {
	margin-top: 48px;
	color: @muted;
	font-size: 12px;
}
@media (max-width: 600px) {
	main {
		padding: 32px 16px;
	}
	.surface {
		padding: 24px;
	}
	.grid {
		grid-template-columns: 1fr;
	}
	.tight span {
		width: 100%;
	}
}
}
</style>
