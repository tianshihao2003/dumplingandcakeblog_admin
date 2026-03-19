import Link from "next/link";
import { Editor } from "@/components/Editor";

export const dynamic = "force-dynamic";

export default function PostNewPage() {
	const defaultPath = "src/content/posts/new-post.md";
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
				<h2 style={{ fontSize: 18, margin: 0 }}>新建文章</h2>
				<Link href="/posts" style={{ color: "inherit" }}>
					返回列表
				</Link>
			</div>

			<p style={{ opacity: 0.8, margin: 0 }}>
				先用默认路径创建，后续可在编辑器里改文件名/目录（或我们下一步加“重命名/移动文件”）。
			</p>

			<Editor
				repoPath={defaultPath}
				initialContent={`---\ntitle: 新文章标题\npublished: ${new Date().toISOString().slice(0, 10)}\ndraft: true\ndescription: \"\"\nimage: \"\"\ntags: []\ncategory: \"\"\ncomment: true\n---\n\n开始写作...\n`}
				defaultCommitMessage="cms: create post"
				onDeleteRedirectTo="/posts"
			/>
		</main>
	);
}

