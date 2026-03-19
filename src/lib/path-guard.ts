const allowedPrefixes = ["src/content/posts/", "src/content/moments/"] as const;
const allowedExts = [".md", ".mdx"] as const;

export function assertAllowedContentPath(repoPath: string) {
	if (!repoPath || typeof repoPath !== "string") {
		throw new Error("invalid_path");
	}
	const normalized = repoPath.replace(/\\/g, "/");
	if (!allowedPrefixes.some((p) => normalized.startsWith(p))) {
		throw new Error("path_not_allowed");
	}
	if (!allowedExts.some((e) => normalized.endsWith(e))) {
		throw new Error("extension_not_allowed");
	}
	// Basic traversal guard
	if (normalized.includes("..")) {
		throw new Error("path_traversal_not_allowed");
	}
	return normalized;
}

export function assertAllowedPrefix(prefix: string) {
	if (!prefix || typeof prefix !== "string") throw new Error("invalid_prefix");
	const normalized = prefix.replace(/\\/g, "/");
	if (!allowedPrefixes.some((p) => normalized === p)) {
		throw new Error("prefix_not_allowed");
	}
	return normalized;
}

