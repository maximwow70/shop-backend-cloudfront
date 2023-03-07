import type { ValidatedEventAPIGatewayProxyEvent } from "src/core/api-gateway";
import { formatJSONResponse } from "src/core/api-gateway";
import { middyfy } from "src/core/lambda";
import { STATUS_CODE } from "src/models/status-code.enum";
import { productValidator } from "src/validators/product.validator";

import productService from "../../database/product.service";

const createProduct: ValidatedEventAPIGatewayProxyEvent<any> = async (
  event: any
) => {
  try {
    const data = event.body;

    const { error } = productValidator(data);
    if (error) {
      console.log(`createProduct: invalid data`);
      return formatJSONResponse(STATUS_CODE.BAD_REQUEST, {
        message: `Can't create a product: ${error}`,
      });
    }

    const product = await productService.createProduct(data);

    console.log(`createProduct success: ${JSON.stringify(product)}`);
    return formatJSONResponse(STATUS_CODE.CREATED, { product });
  } catch (error) {
    console.log(`createProduct failed: ${error}`);
    return formatJSONResponse(STATUS_CODE.SERVER_ERROR, {
      error,
    });
  }
};

export const main = middyfy(createProduct);
