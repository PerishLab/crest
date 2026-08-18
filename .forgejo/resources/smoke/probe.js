import { base, crest, marks, named } from "@perish/crest/crest";

const full = crest("design");
const tight = crest("design", "tight");

for (const one of base.full)
	if (!full.includes(one)) throw new Error("the base did not reach the crest");
if (tight.join() !== base.tight.join())
	throw new Error("the tight step carried a product mark");
if (Object.keys(marks).length !== Object.keys(named).length)
	throw new Error("the marks and the names disagree");

console.log(`crest answers for ${Object.keys(marks).length} products`);
