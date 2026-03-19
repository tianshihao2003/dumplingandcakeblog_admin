import matter from "gray-matter";

export type MatterDoc = {
	data: Record<string, unknown>;
	content: string;
};

export function parseMatter(markdown: string): MatterDoc {
	const res = matter(markdown);
	return { data: res.data as Record<string, unknown>, content: res.content };
}

export function stringifyMatter(doc: MatterDoc): string {
	return matter.stringify(doc.content, doc.data);
}

