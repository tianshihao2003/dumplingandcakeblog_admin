import { z } from "zod";

const schema = z.object({
	NEXTAUTH_SECRET: z.string().min(1),
	GITHUB_OAUTH_CLIENT_ID: z.string().min(1),
	GITHUB_OAUTH_CLIENT_SECRET: z.string().min(1),
	ALLOWED_GITHUB_USERS: z.string().min(1),
	GITHUB_OWNER: z.string().min(1),
	GITHUB_REPO: z.string().min(1),
	GITHUB_BRANCH: z.string().min(1).default("main"),
	GITHUB_TOKEN: z.string().min(1),
});

let cachedEnv: z.infer<typeof schema> | null = null;

export function getEnv() {
	if (cachedEnv) return cachedEnv;
	const parsed = schema.safeParse({
		NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
		GITHUB_OAUTH_CLIENT_ID: process.env.GITHUB_OAUTH_CLIENT_ID,
		GITHUB_OAUTH_CLIENT_SECRET: process.env.GITHUB_OAUTH_CLIENT_SECRET,
		ALLOWED_GITHUB_USERS: process.env.ALLOWED_GITHUB_USERS,
		GITHUB_OWNER: process.env.GITHUB_OWNER,
		GITHUB_REPO: process.env.GITHUB_REPO,
		GITHUB_BRANCH: process.env.GITHUB_BRANCH ?? "main",
		GITHUB_TOKEN: process.env.GITHUB_TOKEN,
	});
	if (!parsed.success) {
		const keys = parsed.error.issues.map((i) => i.path.join(".")).join(", ");
		throw new Error(`missing_env: ${keys}`);
	}
	cachedEnv = parsed.data;
	return cachedEnv;
}

export function allowedGithubUsers(): Set<string> {
	const env = getEnv();
	return new Set(
		env.ALLOWED_GITHUB_USERS.split(",")
			.map((s) => s.trim())
			.filter(Boolean),
	);
}

