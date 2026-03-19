import Link from "next/link";
import { getServerSession } from "next-auth";
import { getAuthOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function HomePage() {
	const session = await getServerSession(getAuthOptions());
	const login = (session?.user as any)?.login as string | undefined;

	return (
		<main style={{ maxWidth: 980, margin: "0 auto", padding: "32px 20px" }}>
			<h1 style={{ fontSize: 22, margin: 0 }}>Firefly Admin</h1>
			<p style={{ opacity: 0.8, marginTop: 8, marginBottom: 18 }}>
				已登录：<b>{login ?? "unknown"}</b>
			</p>

			<div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
				<Link
					href="/posts"
					style={{
						display: "inline-block",
						padding: "10px 14px",
						border: "1px solid rgba(230,237,243,0.16)",
						borderRadius: 10,
						textDecoration: "none",
						color: "inherit",
					}}
				>
					管理文章
				</Link>
				<Link
					href="/moments"
					style={{
						display: "inline-block",
						padding: "10px 14px",
						border: "1px solid rgba(230,237,243,0.16)",
						borderRadius: 10,
						textDecoration: "none",
						color: "inherit",
					}}
				>
					管理动态
				</Link>
			</div>

			<hr style={{ margin: "20px 0", borderColor: "rgba(230,237,243,0.12)" }} />
			<p style={{ opacity: 0.8, margin: 0 }}>
				此后台会直接把改动提交到 GitHub 主分支，从而触发 Vercel 重建发布。
			</p>
		</main>
	);
}

