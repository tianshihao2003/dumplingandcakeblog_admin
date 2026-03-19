"use client";

import { useMemo, useState, useTransition } from "react";
import { parseMatter, stringifyMatter } from "@/lib/matter";

function Field(props: { label: string; children: React.ReactNode }) {
	return (
		<label style={{ display: "grid", gap: 6 }}>
			<span style={{ fontSize: 12, opacity: 0.8 }}>{props.label}</span>
			{props.children}
		</label>
	);
}

export function Editor(props: {
	repoPath: string;
	initialContent: string;
	defaultCommitMessage: string;
	onDeleteRedirectTo: string;
}) {
	const initial = useMemo(() => parseMatter(props.initialContent), [props.initialContent]);

	const [repoPath, setRepoPath] = useState(props.repoPath);
	const [frontmatter, setFrontmatter] = useState(() => JSON.stringify(initial.data, null, 2));
	const [body, setBody] = useState(initial.content);
	const [message, setMessage] = useState(props.defaultCommitMessage);
	const [result, setResult] = useState<string>("");
	const [isPending, startTransition] = useTransition();

	const composed = useMemo(() => {
		try {
			const data = JSON.parse(frontmatter) as Record<string, unknown>;
			return { ok: true as const, value: stringifyMatter({ data, content: body }) };
		} catch (e: any) {
			return { ok: false as const, error: e?.message ?? "frontmatter_json_invalid" };
		}
	}, [frontmatter, body]);

	async function save() {
		if (!composed.ok) {
			setResult(`无法保存：Frontmatter JSON 不合法：${composed.error}`);
			return;
		}
		setResult("");
		const res = await fetch("/api/content/upsert", {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({ path: repoPath, content: composed.value, message }),
		});
		const json = await res.json();
		if (!res.ok) {
			setResult(`保存失败：${json?.error ?? res.status}`);
			return;
		}
		setResult(`已提交：${json.commitSha}`);
	}

	async function del() {
		if (!confirm(`确认删除？\n${repoPath}`)) return;
		setResult("");
		const res = await fetch("/api/content/delete", {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({
				path: repoPath,
				message: `cms: delete ${repoPath}`,
			}),
		});
		const json = await res.json();
		if (!res.ok) {
			setResult(`删除失败：${json?.error ?? res.status}`);
			return;
		}
		window.location.href = props.onDeleteRedirectTo;
	}

	return (
		<div style={{ display: "grid", gap: 12 }}>
			<div
				style={{
					display: "grid",
					gridTemplateColumns: "1fr 1fr",
					gap: 10,
					alignItems: "end",
				}}
			>
				<Field label="仓库路径（相对仓库根目录）">
					<input
						value={repoPath}
						onChange={(e) => setRepoPath(e.target.value)}
						style={{
							background: "rgba(230,237,243,0.06)",
							border: "1px solid rgba(230,237,243,0.16)",
							borderRadius: 10,
							padding: "10px 12px",
							color: "inherit",
						}}
					/>
				</Field>
				<Field label="Commit message">
					<input
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						style={{
							background: "rgba(230,237,243,0.06)",
							border: "1px solid rgba(230,237,243,0.16)",
							borderRadius: 10,
							padding: "10px 12px",
							color: "inherit",
						}}
					/>
				</Field>
			</div>

			<div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 12 }}>
				<Field label="Frontmatter（JSON）">
					<textarea
						value={frontmatter}
						onChange={(e) => setFrontmatter(e.target.value)}
						rows={20}
						style={{
							background: "rgba(230,237,243,0.06)",
							border: `1px solid ${composed.ok ? "rgba(230,237,243,0.16)" : "#ff6b6b"}`,
							borderRadius: 10,
							padding: "10px 12px",
							color: "inherit",
							fontFamily:
								"ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace",
						}}
					/>
				</Field>
				<Field label="正文（Markdown/MDX）">
					<textarea
						value={body}
						onChange={(e) => setBody(e.target.value)}
						rows={20}
						style={{
							background: "rgba(230,237,243,0.06)",
							border: "1px solid rgba(230,237,243,0.16)",
							borderRadius: 10,
							padding: "10px 12px",
							color: "inherit",
							fontFamily:
								"ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace",
						}}
					/>
				</Field>
			</div>

			<div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
				<button
					type="button"
					disabled={isPending}
					onClick={() => startTransition(save)}
					style={{
						background: "#2f81f7",
						border: "none",
						borderRadius: 10,
						padding: "10px 14px",
						color: "white",
						cursor: "pointer",
					}}
				>
					保存并提交
				</button>
				<button
					type="button"
					disabled={isPending}
					onClick={() => startTransition(del)}
					style={{
						background: "transparent",
						border: "1px solid rgba(230,237,243,0.2)",
						borderRadius: 10,
						padding: "10px 14px",
						color: "inherit",
						cursor: "pointer",
					}}
				>
					删除
				</button>
				{result && <span style={{ opacity: 0.85 }}>{result}</span>}
			</div>
		</div>
	);
}

