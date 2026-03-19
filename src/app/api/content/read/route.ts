import { NextResponse } from "next/server";
import { requireSession } from "@/lib/api-auth";
import { readFile } from "@/lib/github";
import { assertAllowedContentPath } from "@/lib/path-guard";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
	const auth = await requireSession();
	if (!auth.ok) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

	try {
		const { searchParams } = new URL(req.url);
		const pathRaw = searchParams.get("path");
		if (!pathRaw) return NextResponse.json({ error: "missing_path" }, { status: 400 });
		const path = assertAllowedContentPath(pathRaw);
		const file = await readFile(path);
		return NextResponse.json(file);
	} catch (e: any) {
		return NextResponse.json({ error: e?.message ?? "internal_error" }, { status: 400 });
	}
}

