import Link from "next/link";
import { Editor } from "@/components/Editor";

export const dynamic = "force-dynamic";

function defaultMomentPath() {
	const d = new Date();
	const yyyy = d.getFullYear();
	const mm = String(d.getMonth() + 1).padStart(2, "0");
	const dd = String(d.getDate()).padStart(2, "0");
	const hh = String(d.getHours()).padStart(2, "0");
	const mi = String(d.getMinutes()).padStart(2, "0");
	return `src/content/moments/${yyyy}-${mm}-${dd}-${hh}${mi}.md`;
}

export default function MomentNewPage() {
	const path = defaultMomentPath();
	return (
		<main style={{ display: "grid", gap: 10 }}>
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					gap: 12,
					flexWrap: "wrap",
				}}
			>
				<h2 style={{ fontSize: 18, margin: 0 }}>新建动态</h2>
				<Link href="/moments" style={{ color: "inherit" }}>
					返回列表
				</Link>
			</div>

			<Editor
				repoPath={path}
				initialContent={`---\nauthor: \"\"\navatar: \"\"\npublished: ${new Date().toISOString()}\ntags: []\nlocation: \"\"\ndevice: \"\"\nimages: []\n---\n\n写点什么...\n`}
				defaultCommitMessage="cms: create moment"
				onDeleteRedirectTo="/moments"
			/>
		</main>
	);
}

