import type { AWS } from "@serverless/typescript";
import { importFileParser, importProductsFile } from "src/functions";

const serverlessConfiguration: AWS = {
  service: "import-service",
  frameworkVersion: "3",
  plugins: ["serverless-esbuild"],
  provider: {
    name: "aws",
    runtime: "nodejs14.x",
    region: "us-east-1",
    stage: "dev",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
    },
    iamRoleStatements: [
      {
        Effect: "Allow",
        Action: ["s3:*"],
        Resource: [
          `arn:aws:s3:::fujifilm-products-service`,
          `arn:aws:s3:::fujifilm-products-service/*`,
        ],
      },
      {
        Effect: "Allow",
        Action: ["sqs:SendMessage", "sqs:GetQueueUrl"],
        Resource: "arn:aws:sqs:us-east-1:298060983177:catalogItemsQueue",
      },
      {
        Effect: "Allow",
        Action: ["lambda:InvokeFunction"],
        Resource:
          "arn:aws:lambda:us-east-1:298060983177:function:authorization-service-dev-basicAuthorizer",
      },
    ],
  },
  // import the function via paths
  functions: { importProductsFile, importFileParser },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk"],
      target: "node14",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
    },
  },
  resources: {
    Resources: {
      GatewayResponse: {
        Type: "AWS::ApiGateway::GatewayResponse",
        Properties: {
          RestApiId: {
            Ref: "ApiGatewayRestApi",
          },
          ResponseType: "DEFAULT_4XX",
          ResponseParameters: {
            "gatewayresponse.header.Access-Control-Allow-Origin": "'*'",
            "gatewayresponse.header.Access-Control-Allow-Headers": "'*'",
          },
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
