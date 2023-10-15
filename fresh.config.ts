import { defineConfig } from "$fresh/server.ts";
import twindPlugin from "$fresh/plugins/twindv1.ts";
import {
  createGoogleOAuthConfig,
  getSessionId,
  handleCallback,
  OAuth2ClientConfig,
  signIn,
  signOut,
} from "$kv_auth";
import { load } from "$std/dotenv/mod.ts";

import twindConfig from "./twind.config.ts";
import { createUserSession, deleteUserSession } from "services/auth.ts";

const env = await load();
const RANKING_ROOT_URL = Deno.env.has("RANKING_ROOT_URL")
  ? Deno.env.get("RANKING_ROOT_URL")
  : env["RANKING_ROOT_URL"];

export const oauthGoogleConfig = createGoogleOAuthConfig({
  redirectUri: `${RANKING_ROOT_URL}/oauth/callback`,
  scope: "https://www.googleapis.com/auth/userinfo.email",
});

const googleOauth = (config: OAuth2ClientConfig) => {
  return {
    name: "kv-oauth",
    routes: [
      {
        path: "/oauth/signin",
        handler: async (req: Request) => await signIn(req, config),
      },
      {
        path: "/oauth/callback",
        handler: async (req: Request) => {
          const { response, tokens, sessionId } = await handleCallback(
            req,
            config,
          );
          await createUserSession({ sessionId, token: tokens.accessToken });

          return response;
        },
      },
      {
        path: "/oauth/signout",
        handler: async (req: Request) => {
          const sessionId = getSessionId(req);
          await deleteUserSession(sessionId!);
          return signOut(req);
        },
      },
    ],
  };
};

export default defineConfig({
  plugins: [
    twindPlugin(twindConfig),
    googleOauth(oauthGoogleConfig),
  ],
});
