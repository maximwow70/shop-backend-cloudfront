import type { ValidatedEventAPIGatewayProxyEvent } from "src/core/api-gateway";
import { formatJSONResponse } from "src/core/api-gateway";
import { middyfy } from "src/core/lambda";

import productsService from "../../database/product.service";

const getProducts: ValidatedEventAPIGatewayProxyEvent<any> = async () => {
  const products: any[] = await productsService.getAllProducts();
  return formatJSONResponse(200, products);
};

export const main = middyfy(getProducts);
