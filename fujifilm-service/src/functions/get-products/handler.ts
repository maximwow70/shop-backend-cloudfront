import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { productsMock } from "src/mocks/products.mock";

const getProducts: ValidatedEventAPIGatewayProxyEvent<any> = async () => {
  return formatJSONResponse(200, await productsMock);
};

export const main = middyfy(getProducts);
