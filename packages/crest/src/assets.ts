import {
	catalog,
	product,
	type Surface,
	sizes,
	surfaces,
} from "./model/catalog.ts";

export type Request = {
	product: string;
	form: "sign";
	step: "full" | "tight";
	medium: "svg" | "png";
	surface: Surface;
	size: number;
};

export type Asset = ReturnType<typeof descriptor> & { digest: string };
export type Manifest = {
	schema: "crest.assets/v1";
	model: { name: "u22"; digest: string };
	assets: Asset[];
};

export function requests(): Request[] {
	return Object.keys(catalog).flatMap((name) =>
		surfaces.flatMap((surface): Request[] => [
			{
				product: name,
				form: "sign",
				step: "full",
				medium: "svg",
				surface,
				size: 100,
			},
			...sizes.map(
				(size): Request => ({
					product: name,
					form: "sign",
					step: "full",
					medium: "png",
					surface,
					size,
				}),
			),
		]),
	);
}

export function descriptor(request: Request) {
	const key = product(request.product);
	if (request.form !== "sign")
		throw new Error(`Unsupported Crest form: ${request.form}`);
	if (request.step !== "full")
		throw new Error(`Unsupported U22 step: ${request.step}`);
	if (!surfaces.includes(request.surface))
		throw new Error(`Unsupported Crest surface: ${request.surface}`);
	const formats: Record<string, readonly number[]> = { svg: [100], png: sizes };
	const supported = Object.hasOwn(formats, request.medium)
		? formats[request.medium]
		: [];
	if (!supported.includes(request.size))
		throw new Error(
			`Unsupported Crest medium or size: ${request.medium}/${request.size}`,
		);
	return {
		id: `${key}/sign/full/${request.surface}/${request.medium}/${request.size}`,
		product: key,
		kind: catalog[key],
		form: request.form,
		step: request.step,
		medium: request.medium,
		surface: request.surface,
		width: request.size,
		height: request.size,
		file: `media/u22/${key}/${request.surface}/sign-${request.size}.${request.medium}`,
	};
}

function record(value: unknown): Record<string, unknown> {
	if (value === null || typeof value !== "object")
		throw new Error("Invalid Crest record");
	if (Array.isArray(value)) throw new Error("Invalid Crest record");
	return value as Record<string, unknown>;
}

function digest(value: unknown): boolean {
	return typeof value === "string" && /^sha256:[a-f0-9]{64}$/.test(value);
}

export function read(value: unknown): Manifest {
	const manifest = record(value);
	if (Object.keys(manifest).length !== 3)
		throw new Error("Invalid Crest manifest fields");
	if (manifest.schema !== "crest.assets/v1")
		throw new Error("Unsupported Crest manifest schema");
	const model = record(manifest.model);
	if (Object.keys(model).length !== 2)
		throw new Error("Invalid Crest model fields");
	if (model.name !== "u22" || !digest(model.digest))
		throw new Error("Invalid Crest model identity");
	if (!Array.isArray(manifest.assets))
		throw new Error("Invalid Crest asset list");
	const expected = new Map(
		requests().map((request) => {
			const item = descriptor(request);
			return [item.id, item] as const;
		}),
	);
	for (const value of manifest.assets) {
		const item = record(value);
		const wanted = expected.get(String(item.id));
		if (!wanted) throw new Error("Unknown or duplicate Crest asset");
		if (!Object.entries(wanted).every(([key, value]) => item[key] === value))
			throw new Error("Invalid Crest asset selection or file");
		if (!digest(item.digest)) throw new Error("Invalid Crest asset digest");
		if (Object.keys(item).length !== Object.keys(wanted).length + 1)
			throw new Error("Invalid Crest asset fields");
		expected.delete(wanted.id);
	}
	if (expected.size !== 0) throw new Error("Incomplete Crest manifest");
	return value as Manifest;
}

export function asset(manifest: Manifest, request: Request): Asset {
	const wanted = descriptor(request);
	const found = read(manifest).assets.find((item) => item.id === wanted.id);
	if (!found) throw new Error(`Missing Crest asset: ${wanted.id}`);
	return found;
}
