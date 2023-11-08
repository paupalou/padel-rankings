import { ulid } from "$ulid";
import {
  createGoogleOAuthConfig,
  getSessionId,
  handleCallback,
  signIn,
  signOut,
} from "$kv_auth";

import db from "services/database.ts";
import getEnv from "env";

import type { GoogleUserInfo, User } from "types";

const oauthGoogleConfig = createGoogleOAuthConfig({
  redirectUri: `${getEnv("RANKING_ROOT_URL")}/oauth/callback`,
  scope: "https://www.googleapis.com/auth/userinfo.email",
});

export async function getUser(email: string) {
  const userKey = ["user", email];
  const userRes = (await db.get<User>(userKey)).value;

  if (!userRes) return false;

  return userRes;
}

export async function getSession(sessionId: string) {
  const sessionKey = ["user_session", sessionId];
  const sessionRes = (await db.get<GoogleUserInfo>(sessionKey)).value;

  if (!sessionRes) return false;

  return sessionRes;
}

export async function getGoogleUserInfo(
  token: string,
): Promise<GoogleUserInfo> {
  const userInfoRes = await fetch(
    `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${token}`,
  );

  return await userInfoRes.json();
}

export async function createUserSession(
  { sessionId, token }: Record<string, string>,
) {
  const userInfo = await getGoogleUserInfo(token);
  const adminAccounts: string[] =
    getEnv("ADMIN_ACCOUNTS") as unknown as string[] ?? [];
  const { email } = userInfo;

  if (!await getUser(email)) {
    const userId = ulid();
    const user = { id: userId, email, createdAt: new Date() };
    db.set(["user", email], user);
  }

  db.set(["user_session", sessionId], {
    ...userInfo,
    admin: adminAccounts.includes(email),
  });
}

export function deleteUserSession(sessionId: string) {
  return db.delete(["user_session", sessionId!]);
}

export const googleOauth = {
  name: "kv-oauth",
  routes: [
    {
      path: "/oauth/signin",
      handler: async (req: Request) => await signIn(req, oauthGoogleConfig),
    },
    {
      path: "/oauth/callback",
      handler: async (req: Request) => {
        const { response, tokens, sessionId } = await handleCallback(
          req,
          oauthGoogleConfig,
        );
        await createUserSession({ sessionId, token: tokens.accessToken });

        return response;
      },
    },
    {
      path: "/oauth/signout",
      handler: async (req: Request) => {
        const sessionId = await getSessionId(req);
        await deleteUserSession(sessionId!);
        return await signOut(req);
      },
    },
  ],
};
