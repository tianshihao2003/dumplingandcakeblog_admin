import { getServerSession } from "next-auth";
import { getAuthOptions } from "@/lib/auth";

export async function requireSession() {
	const session = await getServerSession(getAuthOptions());
	if (!session) {
		return { ok: false as const, session: null };
	}
	return { ok: true as const, session };
}

