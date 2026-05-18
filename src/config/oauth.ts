import { OAuth2Client } from "google-auth-library";

import { envConfig } from "./env.config";

export const googleOAuthClient = new OAuth2Client(
  envConfig.googleClientId
);