import { handlerPath } from "src/core/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: "get",
        path: "token",
        cors: true,
      },
    },
  ],
};
