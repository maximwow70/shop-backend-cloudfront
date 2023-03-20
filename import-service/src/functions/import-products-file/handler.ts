import type { ValidatedEventAPIGatewayProxyEvent } from "src/core/api-gateway";
import { formatJSONResponse } from "src/core/api-gateway";
import { middyfy } from "src/core/lambda";
import { STATUS_CODE } from "src/core/models/status-code.enum";

const importProductsFile: ValidatedEventAPIGatewayProxyEvent<any> = async (
  event
) => {
  try {
    const name: string = event.pathParameters?.name;
    const url = `https://fujifilm-products-service.s3.amazonaws.com/uploaded/${name}`;
    console.log(`Create signed URL: ${url}`);
    return formatJSONResponse(STATUS_CODE.OK, { url });
  } catch (error) {
    console.log(`Create signed URL failed`);
    return formatJSONResponse(STATUS_CODE.SERVER_ERROR, { error });
  }
};

export const main = middyfy(importProductsFile);
