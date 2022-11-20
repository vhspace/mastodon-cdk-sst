import { App } from "@serverless-stack/resources";
import { Mastodon } from "./Mastodon";
import { Network } from "./Network";
import { Postgres } from "./Postgres";
import { Redis } from "./Redis";
import { Route53 } from "./Route53";
import { Secrets } from "./Secrets";

export default function (app: App) {
  app.setDefaultFunctionProps({
    runtime: "nodejs16.x",
    srcPath: "services",
    bundle: {
      format: "esm",
    },
    timeout: "10 seconds",
    memorySize: 1024,
  });

  app
    .stack(Route53)
    .stack(Network)
    .stack(Secrets)
    .stack(Postgres)
    .stack(Redis)
    .stack(Mastodon);
}
