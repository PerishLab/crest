# crest

The brand of the `perish.code` domain, as source.

One base geometry, one mark per product, and the axes along which either may
vary. The base is exported once and a product declares only its own mark, so a
variant that redraws the base cannot be written.

```ts
import { crest, named } from "@perish/crest/crest";

crest("design");          // the base, plus design's mark
crest("design", "tight"); // the domain's crest, drawn for sixteen pixels
named.design;             // { owner: "@perish/", name: "design" }
```

A step is drawn, never scaled. See `AGENTS.md`.

MIT.
