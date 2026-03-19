import { NextResponse } from "next/server";
import { z } from "zod";
import { requireSession } from "@/lib/api-auth";
import { deleteFile, readFile } from "@/lib/github";
import { assertAllowedContentPath } from "@/lib/path-guard";

export const dynamic = "force-dynamic";

const bodySchema = z.object({
	path: z.string().min(1),
	message: z.string().min(1),
});

export async function POST(req: Request) {
	const auth = await requireSession();
	if (!auth.ok) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

	const parsed = bodySchema.safeParse(await req.json().catch(() => null));
	if (!parsed.success) {
		return NextResponse.json({ error: "invalid_body", issues: parsed.error.issues }, { status: 400 });
	}

	const { path, message } = parsed.data;
	let safePath: string;
	try {
		safePath = assertAllowedContentPath(path);
	} catch (e: any) {
		return NextResponse.json({ error: e?.message ?? "path_not_allowed" }, { status: 400 });
	}

	try {
		const existing = await readFile(safePath);
		const res = await deleteFile({ repoPath: safePath, sha: existing.sha, message });
		return NextResponse.json(res);
	} catch (e: any) {
		return NextResponse.json({ error: e?.message ?? "github_delete_failed" }, { status: 500 });
	}
}

