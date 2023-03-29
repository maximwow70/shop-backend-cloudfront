import { handlerPath } from "src/core/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: "get",
        path: "import/{name}",
        cors: true,
        authorizer: {
          name: "basicAuthorizer",
          arn: "arn:aws:lambda:us-east-1:298060983177:function:authorization-service-dev-basicAuthorizer",
          resultTtlInSeconds: 0,
          identitySource: "method.request.header.Authorization",
          type: "request",
        },
      },
    },
  ],
};
