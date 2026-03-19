import NextAuth from "next-auth";
import { getAuthOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request, context: any) {
	const handler = NextAuth(getAuthOptions());
	return handler(request as any, context);
}

export async function POST(request: Request, context: any) {
	const handler = NextAuth(getAuthOptions());
	return handler(request as any, context);
}

