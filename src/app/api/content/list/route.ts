import { NextResponse } from "next/server";
import { requireSession } from "@/lib/api-auth";
import { listFilesRecursive } from "@/lib/github";
import { assertAllowedPrefix } from "@/lib/path-guard";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
	const auth = await requireSession();
	if (!auth.ok) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

	try {
		const { searchParams } = new URL(req.url);
		const prefixRaw = searchParams.get("prefix");
		if (!prefixRaw) return NextResponse.json({ error: "missing_prefix" }, { status: 400 });
		const prefix = assertAllowedPrefix(prefixRaw);
		const files = await listFilesRecursive(prefix);
		return NextResponse.json({ files });
	} catch (e: any) {
		return NextResponse.json({ error: e?.message ?? "internal_error" }, { status: 400 });
	}
}

