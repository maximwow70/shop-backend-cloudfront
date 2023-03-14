import { STATUS_CODE } from "@shop/core";

import type { ValidatedEventAPIGatewayProxyEvent } from "src/core/api-gateway";
import { formatJSONResponse } from "src/core/api-gateway";
import { middyfy } from "src/core/lambda";

import { S3 } from "aws-sdk";

const importProductsFile: ValidatedEventAPIGatewayProxyEvent<
  any
> = async () => {
  const s3 = new S3({ region: "us-east-1" });
  try {
    const response = await s3
      .listObjectsV2({
        Bucket: "fujifilm-products-service",
        Prefix: "uploaded/",
      })
      .promise();
    const photos = response.Contents.filter((photo) => photo.Size).map(
      (photo) => {
        return `https://fujifilm-products-service.s3.amazonaws.com/${photo.Key}`;
      }
    );
    console.log(`Import success`);
    return formatJSONResponse(STATUS_CODE.OK, photos);
  } catch (error) {
    console.log(`Import failed`);
    return formatJSONResponse(STATUS_CODE.SERVER_ERROR, { error });
  }
};

export const main = middyfy(importProductsFile);
