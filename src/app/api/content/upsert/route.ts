import { NextResponse } from "next/server";
import { z } from "zod";
import { requireSession } from "@/lib/api-auth";
import { readFile, upsertFile } from "@/lib/github";
import { assertAllowedContentPath } from "@/lib/path-guard";

export const dynamic = "force-dynamic";

const bodySchema = z.object({
	path: z.string().min(1),
	content: z.string(),
	message: z.string().min(1),
});

export async function POST(req: Request) {
	const auth = await requireSession();
	if (!auth.ok) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

	const parsed = bodySchema.safeParse(await req.json().catch(() => null));
	if (!parsed.success) {
		return NextResponse.json({ error: "invalid_body", issues: parsed.error.issues }, { status: 400 });
	}

	let { path, content, message } = parsed.data;
	try {
		path = assertAllowedContentPath(path);
	} catch (e: any) {
		return NextResponse.json({ error: e?.message ?? "path_not_allowed" }, { status: 400 });
	}

	// If file exists, fetch sha; if not, proceed without sha.
	let sha: string | undefined;
	try {
		const existing = await readFile(path);
		sha = existing.sha;
	} catch {
		sha = undefined;
	}

	try {
		const res = await upsertFile({
			repoPath: path,
			contentUtf8: content,
			message,
			sha,
		});
		return NextResponse.json(res);
	} catch (e: any) {
		return NextResponse.json({ error: e?.message ?? "github_write_failed" }, { status: 500 });
	}
}

