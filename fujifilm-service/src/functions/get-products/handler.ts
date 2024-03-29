import type { ValidatedEventAPIGatewayProxyEvent } from "src/core/api-gateway";
import { formatJSONResponse } from "src/core/api-gateway";
import { middyfy } from "src/core/lambda";
import { Product } from "src/core/models/product";
import { STATUS_CODE } from "src/core/models/status-code.enum";
import productsService from "../../database/product.service";

const getProducts: ValidatedEventAPIGatewayProxyEvent<any> = async () => {
  try {
    const products: Product[] = await productsService.getProducts();
    console.log(`getProducts success: ${products}`);
    return formatJSONResponse(STATUS_CODE.OK, products);
  } catch (error) {
    console.log(`getProducts failed`);
    return formatJSONResponse(STATUS_CODE.SERVER_ERROR, { error });
  }
};

export const main = middyfy(getProducts);
