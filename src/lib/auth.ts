import type { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { allowedGithubUsers, getEnv } from "@/lib/env";

export function getAuthOptions(): NextAuthOptions {
	const env = getEnv();
	return {
		secret: env.NEXTAUTH_SECRET,
		providers: [
			GithubProvider({
				clientId: env.GITHUB_OAUTH_CLIENT_ID,
				clientSecret: env.GITHUB_OAUTH_CLIENT_SECRET,
			}),
		],
		session: { strategy: "jwt" },
		callbacks: {
			async signIn({ profile }) {
				// GitHub profile has `login`
				const login = (profile as any)?.login as string | undefined;
				if (!login) return false;
				return allowedGithubUsers().has(login);
			},
			async jwt({ token, profile }) {
				if (profile) {
					(token as any).login = (profile as any).login;
				}
				return token;
			},
			async session({ session, token }) {
				(session.user as any) = {
					...(session.user ?? {}),
					login: (token as any).login,
				};
				return session;
			},
		},
	};
}

