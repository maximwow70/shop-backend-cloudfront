import type { ValidatedEventAPIGatewayProxyEvent } from "src/core/api-gateway";
import { formatJSONResponse } from "src/core/api-gateway";
import { middyfy } from "src/core/lambda";
import { Product } from "src/models/product";
import { STATUS_CODE } from "src/models/status-code.enum";

import productsService from "../../database/product.service";

const getProductById: ValidatedEventAPIGatewayProxyEvent<any> = async (
  event: any
) => {
  try {
    const product: Product = await productsService.getProduct(
      event.pathParameters?.id
    );
    if (product) {
      console.log(`getProductById success: ${product}`);
      return formatJSONResponse(STATUS_CODE.OK, { product });
    } else {
      console.log(`getProductById not found`);
      return formatJSONResponse(STATUS_CODE.NOT_FOUND, { error: "Not found" });
    }
  } catch (error) {
    console.log(`getProductById failed`);
    return formatJSONResponse(STATUS_CODE.SERVER_ERROR, { error });
  }
};

export const main = middyfy(getProductById);
