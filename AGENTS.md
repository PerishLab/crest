# Agents

Read the canonical [PerishLab delivery governance](https://github.com/PerishLab/.github/blob/main/GOVERNANCE.md)
at work start and again before delivery or Issue closure. That document owns
organization-wide Issue, pull-request and acceptance policy; this file keeps
repository-specific constraints without copying that policy.

This repository owns the brand of the `perish.code` domain: one base geometry,
one mark per product, and the axes along which either may vary.

## Identity

- `packages/crest` publishes `@perishlab/crest`. It is pure source. It knows
  nothing of Svelte, of a design system, or of a renderer, and it never will.
- It exists apart from `@perishlab/design` because the two grow along different
  axes and answer to opposite obligations. A design system grows by look times
  component and **must** change when the language changes; a brand grows by
  product and **must not**. Filed together, the crest is read as a look.
- The same argument split `@perishlab/sign` out of the design package one level
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
| medium | svg, png, og | `media`, `vector`, generated package media |

A step is drawn, never scaled. A crest at sixteen pixels is not the same
geometry as one at ninety six, and the law refuses a `tight` step that carries
as many commands as its `full`. At `tight` the crest carries no product mark at
all: a favicon says the domain, which is the position most brand systems reach
and this one states outright.

## Colour

`ink` is the brand colour. `palette` owns its dark-surface counterpart, neutral
ground and reverse. A bearing without a surface takes these colours explicitly.

No consumer redraws or recolours the crest as a design-system language. The
media contract renders browser, touch and sharing bearings from the same base
and product paths, then the media script materialises package assets from it.

## Release

`apps/review` is a private-package static review surface. Its dependency-free Node
build renders only the existing source geometry and labels it as a baseline,
never a new adopted brand direction. It is outside the npm publication allowlist.
Its initial B0-full/B0-tight, named marks, size, light/dark and context examples
are authorized public review material. The native Preview declaration binds only
the dedicated non-production `crest-review` Worker established in
PerishLab/.github#78, with ordinary workers.dev deployment disabled. Preview apps
are excluded from ordinary Worker shipping as well as npm publication.
Configuration grants no deployment and proves no live Preview URL; operational
integration remains separate work under #12. Private Concord Artifacts are not
public review material.

`plumb.toml` declares the product `crest`, its authority and an npm attachment,
and no binary shape: `@perishlab/crest` is the one thing that publishes, to
GitHub Packages, and `.npmrc` maps the scope there. The package declares version
`0.0.0`. A release follows Plumb's lifecycle (`plumb release --help`); wharf stamps the
version into the package and publishes it. A stable's changelog goes to the
Depot.

## Guard

Run `pnpm check`, `pnpm typecheck`, `pnpm test`, `plumb doctor .`, and
`ectropy .`. Verify by exit code. `plumb configuration install` projects the
guard hooks, and every commit carries the proof Plumb's guard takes over the
exact staged tree.

`pnpm look` is the browser lane and is not in the guard chain. It measures what
only a renderer can answer: that every mark stands inside the hold the base
leaves it, and that every base fills the frame. It needs `playwright-cli`.
