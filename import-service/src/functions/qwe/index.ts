import { handlerPath } from "src/core/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      s3: {
        bucket: "get",
        event: "s3:ObjectCreated:*",
        rules: {
          prefix: "uploaded/",
        },
        existing: true,
      },
    },
  ] as any,
};
