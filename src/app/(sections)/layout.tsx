import type { ReactNode } from "react";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { getAuthOptions } from "@/lib/auth";

export default async function SectionLayout(props: { children: ReactNode }) {
	const session = await getServerSession(getAuthOptions());
	const login = (session?.user as any)?.login as string | undefined;

	return (
		<div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 20px" }}>
			<header
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					gap: 12,
					marginBottom: 16,
				}}
			>
				<div style={{ display: "flex", alignItems: "center", gap: 12 }}>
					<Link href="/" style={{ color: "inherit", textDecoration: "none" }}>
						<b>Firefly Admin</b>
					</Link>
					<nav style={{ display: "flex", gap: 10, opacity: 0.9 }}>
						<Link href="/posts" style={{ color: "inherit" }}>
							文章
						</Link>
						<Link href="/moments" style={{ color: "inherit" }}>
							动态
						</Link>
					</nav>
				</div>
				<div style={{ display: "flex", alignItems: "center", gap: 10 }}>
					<span style={{ opacity: 0.75 }}>{login}</span>
					<a
						href="/api/auth/signout"
						style={{
							color: "inherit",
							textDecoration: "none",
							border: "1px solid rgba(230,237,243,0.16)",
							padding: "8px 10px",
							borderRadius: 10,
						}}
					>
						退出
					</a>
				</div>
			</header>
			{props.children}
		</div>
	);
}

