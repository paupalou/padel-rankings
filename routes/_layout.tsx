import { LayoutContext } from "$fresh/server.ts";
import { getSessionId } from "$kv_auth";

import Button from "components/button.tsx";
import db from "services/database.ts";
import { GoogleUserInfo } from "types";
import getEnv from "env";
import { useSignal } from "@preact/signals";

type UserProps = {
  isLogged: boolean;
  isAdmin: boolean;
  email?: string;
};

function User(
  { user, onAdminPage }: { user: UserProps; onAdminPage: boolean },
) {
console.debug(user)
  return (
    <div className="flex py-2 justify-between items-center">
      <span className="flex text-sm gap-1">
        {user.isLogged && <span className="text-slate-400">{user.email}</span>}
      </span>
      <div name="user-actions" className="flex gap-1">
        {user.isAdmin &&
          (
            <Button>
              <a href={onAdminPage ? "/" : `${getEnv("RANKING_ROOT_URL")}/admin`}>
                {onAdminPage ? "Home" : "Admin"}
              </a>
            </Button>
          )}
        <Button>
          {user.isLogged
            ? <a href="/oauth/signout">Logout</a>
            : <a href="/oauth/signin">Login</a>}
        </Button>
      </div>
    </div>
  );
}

export default async function Layout(req: Request, ctx: LayoutContext) {
  const sessionId = getSessionId(req);
  const user: UserProps = { isLogged: !!sessionId, isAdmin: false };
  const onAdminPage = req.url.startsWith(`${getEnv("RANKING_ROOT_URL")}/admin`);

  if (sessionId) {
    const userSession = await db.get<GoogleUserInfo>([
      "user_session",
      sessionId,
    ]);
    user.isAdmin = Boolean(userSession.value?.admin);
    user.email = userSession.value?.email!;
  }

  return (
    <main class="px-2 lg:max-w-xl font-varela h-screen relative">
      <User user={user} onAdminPage={onAdminPage} />
      <ctx.Component />
    </main>
  );
}
