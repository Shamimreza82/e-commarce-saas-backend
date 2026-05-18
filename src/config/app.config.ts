import { envConfig } from "./env.config";



export const appConfig = {
  port: envConfig.port,
  trustProxy: envConfig.trustProxy,
  isProduction: envConfig.nodeEnv === 'production',
};
