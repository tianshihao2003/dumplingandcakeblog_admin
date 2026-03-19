import Link from "next/link";
import { readFile } from "@/lib/github";
import { Editor } from "@/components/Editor";

export const dynamic = "force-dynamic";

export default async function MomentEditPage(props: {
	searchParams?: { path?: string };
}) {
	const path = props.searchParams?.path;
	if (!path) {
		return (
			<main>
				<p>缺少 path 参数。</p>
				<Link href="/moments" style={{ color: "inherit" }}>
					返回
				</Link>
			</main>
		);
	}

	const file = await readFile(path);

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
				<h2 style={{ fontSize: 18, margin: 0 }}>编辑动态</h2>
				<Link href="/moments" style={{ color: "inherit" }}>
					返回列表
				</Link>
			</div>
			<div style={{ opacity: 0.75 }}>
				路径：<code>{path}</code>
			</div>
			<Editor
				repoPath={path}
				initialContent={file.content}
				defaultCommitMessage={`cms: update moment ${path.replace("src/content/moments/", "")}`}
				onDeleteRedirectTo="/moments"
			/>
		</main>
	);
}

