import { handlerPath } from "src/core/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      s3: {
        bucket: "fujifilm-products-service",
        event: "s3:ObjectCreated:*",
        rules: [
          {
            prefix: "uploaded/",
          },
        ],
        existing: true,
      },
    },
  ],
};
