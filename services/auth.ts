import { GoogleUserInfo, User } from "types";
import db from "services/database.ts";
import getEnv from "env";
import { ulid } from "$ulid";

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
