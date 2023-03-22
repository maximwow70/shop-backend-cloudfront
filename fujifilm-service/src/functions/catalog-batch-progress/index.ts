import { handlerPath } from "src/core/handler-resolver";
import { AWS } from "@serverless/typescript";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  environment: {
    CREATE_PRODUCT_TOPIC_ARN: { Ref: "createProductTopic" },
  },
  events: [
    {
      sqs: {
        arn: {
          "Fn::GetAtt": ["CatalogItemsQueue", "Arn"],
        },
        batchSize: 5,
      },
    },
  ],
} as AWS["functions"]["string"];
