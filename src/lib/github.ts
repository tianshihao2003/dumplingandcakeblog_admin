import { getEnv } from "@/lib/env";

export type GithubContentFile = {
	type: "file";
	name: string;
	path: string;
	sha: string;
	size: number;
	url: string;
	html_url: string;
	git_url: string;
	download_url: string | null;
};

export type GithubContentDir = {
	type: "dir";
	name: string;
	path: string;
	sha: string;
	url: string;
	html_url: string;
	git_url: string;
	download_url: null;
};

export type GithubContent = GithubContentFile | GithubContentDir;

type GithubError = { message?: string; documentation_url?: string };

function ghHeaders() {
	const env = getEnv();
	return {
		Authorization: `Bearer ${env.GITHUB_TOKEN}`,
		Accept: "application/vnd.github+json",
		"X-GitHub-Api-Version": "2022-11-28",
	} as const;
}

async function ghFetch(path: string, init?: RequestInit) {
	const url = `https://api.github.com${path}`;
	const res = await fetch(url, {
		...init,
		headers: {
			...ghHeaders(),
			...(init?.headers ?? {}),
		},
		cache: "no-store",
	});
	if (!res.ok) {
		let details: GithubError | undefined;
		try {
			details = (await res.json()) as GithubError;
		} catch {
			// ignore
		}
		const msg = details?.message
			? `${details.message} (${res.status})`
			: `GitHub API error (${res.status})`;
		throw new Error(msg);
	}
	return res;
}

export async function listDir(repoPath: string): Promise<GithubContent[]> {
	const env = getEnv();
	const owner = env.GITHUB_OWNER;
	const repo = env.GITHUB_REPO;
	const branch = env.GITHUB_BRANCH;
	const res = await ghFetch(
		`/repos/${owner}/${repo}/contents/${encodeURIComponent(repoPath)}?ref=${encodeURIComponent(branch)}`,
	);
	return (await res.json()) as GithubContent[];
}

export async function readFile(repoPath: string): Promise<{
	sha: string;
	content: string; // decoded
}> {
	const env = getEnv();
	const owner = env.GITHUB_OWNER;
	const repo = env.GITHUB_REPO;
	const branch = env.GITHUB_BRANCH;
	const res = await ghFetch(
		`/repos/${owner}/${repo}/contents/${encodeURIComponent(repoPath)}?ref=${encodeURIComponent(branch)}`,
	);
	const json = (await res.json()) as {
		sha: string;
		content: string;
		encoding: "base64";
	};
	const decoded = Buffer.from(json.content, "base64").toString("utf8");
	return { sha: json.sha, content: decoded };
}

export async function upsertFile(args: {
	repoPath: string;
	contentUtf8: string;
	message: string;
	sha?: string;
}): Promise<{ commitSha: string; contentSha: string }> {
	const env = getEnv();
	const owner = env.GITHUB_OWNER;
	const repo = env.GITHUB_REPO;
	const branch = env.GITHUB_BRANCH;

	const body = {
		message: args.message,
		content: Buffer.from(args.contentUtf8, "utf8").toString("base64"),
		branch,
		sha: args.sha,
	};

	const res = await ghFetch(`/repos/${owner}/${repo}/contents/${encodeURIComponent(args.repoPath)}`, {
		method: "PUT",
		body: JSON.stringify(body),
	});
	const json = (await res.json()) as {
		commit: { sha: string };
		content: { sha: string };
	};
	return { commitSha: json.commit.sha, contentSha: json.content.sha };
}

export async function deleteFile(args: {
	repoPath: string;
	sha: string;
	message: string;
}): Promise<{ commitSha: string }> {
	const env = getEnv();
	const owner = env.GITHUB_OWNER;
	const repo = env.GITHUB_REPO;
	const branch = env.GITHUB_BRANCH;

	const body = {
		message: args.message,
		sha: args.sha,
		branch,
	};

	const res = await ghFetch(`/repos/${owner}/${repo}/contents/${encodeURIComponent(args.repoPath)}`, {
		method: "DELETE",
		body: JSON.stringify(body),
	});
	const json = (await res.json()) as { commit: { sha: string } };
	return { commitSha: json.commit.sha };
}

export async function listFilesRecursive(prefix: string): Promise<string[]> {
	const env = getEnv();
	const owner = env.GITHUB_OWNER;
	const repo = env.GITHUB_REPO;
	const branch = env.GITHUB_BRANCH;

	const res = await ghFetch(
		`/repos/${owner}/${repo}/git/trees/${encodeURIComponent(branch)}?recursive=1`,
	);
	const json = (await res.json()) as {
		tree: Array<{ path: string; type: "blob" | "tree" }>;
	};
	return json.tree
		.filter((n) => n.type === "blob")
		.map((n) => n.path)
		.filter((p) => p.startsWith(prefix))
		.filter((p) => p.endsWith(".md") || p.endsWith(".mdx"));
}

// 扫描本地文件系统的函数
export async function listLocalFilesRecursive(directory: string): Promise<string[]> {
	const fs = require('fs');
	const path = require('path');
	
	const files: string[] = [];
	
	// 构建绝对路径，确保指向项目根目录下的 public 目录
	const projectRoot = path.resolve(__dirname, '../../..');
	const absolutePath = path.join(projectRoot, directory.replace(/^\.\.\//, ''));
	
	function walk(currentPath: string) {
		const items = fs.readdirSync(currentPath);
		
		for (const item of items) {
			const fullPath = path.join(currentPath, item);
			const stat = fs.statSync(fullPath);
			
			if (stat.isDirectory()) {
				walk(fullPath);
			} else if (stat.isFile()) {
				// 转换为相对路径，从 public 目录开始
				const relativePath = fullPath.replace(absolutePath, '').replace(/\\/g, '/').replace(/^\//, '');
				files.push(relativePath);
			}
		}
	}
	
	walk(absolutePath);
	return files;
}

