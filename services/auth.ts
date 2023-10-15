import { GoogleUserInfo } from "types";
import db from "services/database.ts";
import getEnv from "env";

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

  db.set(["user_session", sessionId], {
    ...userInfo,
    admin: adminAccounts.includes(userInfo.email),
  });
}

export function deleteUserSession(sessionId: string) {
  return db.delete(["user_session", sessionId!]);
}
