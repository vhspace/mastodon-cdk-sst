# Mastodon CDK SST

Deploy Mastodon instances using AWS CDK and Serverless Stack.

## Quickstart

Create a stage (e.g. `prod`) to deploy your instance by copying `.env` to `.env.prod` and editing it.

```shell
npm i -g pnpm  # install pnpm globally
pnpm i  # install dependencies
pnpm exec sst deploy --stage prod
```
