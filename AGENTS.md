# Agents

This repository owns the brand of the `perish.code` domain: one base geometry,
one mark per product, and the axes along which either may vary.

## Identity

- `packages/crest` publishes `@perish/crest`. It is pure source. It knows
  nothing of Svelte, of a design system, or of a renderer, and it never will.
- It exists apart from `@perish/design` because the two grow along different
  axes and answer to opposite obligations. A design system grows by look times
  component and **must** change when the language changes; a brand grows by
  product and **must not**. Filed together, the crest is read as a look.
- The same argument split `@perish/sign` out of the design package one level
  down: shapes grow by system times preference, generators do not.

## Shape

The base geometry is exported once and a product declares only its own mark, so
a variant that redraws the base cannot be written. What is left over is
falsifiable and is written as a law.

Four axes vary a crest. Only the first three live here; the fourth is a
renderer over them and is not built.

| Axis | Values | Held |
|---|---|---|
| product | `perish.code`, `design`, `plumb`, `concord` | `marks`, `named` |
| step | `full`, `tight` | `base` |
| form | sign, lockup, wordtype | `crest`, `named` |
| medium | svg, ico, png, og | nowhere yet |

A step is drawn, never scaled. A crest at sixteen pixels is not the same
geometry as one at ninety six, and the law refuses a `tight` step that carries
as many commands as its `full`. At `tight` the crest carries no product mark at
all: a favicon says the domain, which is the position most brand systems reach
and this one states outright.

## Colour

`ink` is the brand colour and it is a placeholder with a stated origin: it is
the accent the design system's own base language already used, not a colour
anyone designed.

The design package paints the crest in `--accent`, so it is blue in base, green
in terminal and red in brutal. That was right while a crest only ever stood
inside a themed surface, and this repository is what makes it wrong: a favicon,
an open graph card and a readme badge have no language to inherit from. Any
bearing without a surface must be handed a colour rather than left to inherit.

## Release

`plumb.toml` declares an npm attachment and no binary shape, which is the whole
declaration a source-only package needs: no product, no authority, no target.
The lanes are rendered from it by `plumb lane --write` and must never be edited
by hand.

## Guard

Run `pnpm check`, `pnpm typecheck`, `pnpm test`, `plumb doctor .`, and
`ectropy .`. Verify by exit code. The rendered guard lane runs the same work
through `pnpm biome ci .`, `pnpm -r exec tsc --noEmit` and `pnpm -r test`.

`pnpm look` is the browser lane and is not in the guard chain. It measures what
only a renderer can answer: that every mark stands inside the hold the base
leaves it, and that every base fills the frame. It needs `playwright-cli`.
