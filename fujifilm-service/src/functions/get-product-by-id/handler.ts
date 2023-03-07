import type { ValidatedEventAPIGatewayProxyEvent } from "src/core/api-gateway";
import { formatJSONResponse } from "src/core/api-gateway";
import { middyfy } from "src/core/lambda";
import { Product } from "src/models/product";

import productsService from "../../database/product.service";

const getProductById: ValidatedEventAPIGatewayProxyEvent<any> = async (
  event: any
) => {
  const products: any[] = await productsService.getAllProducts();

  const requestedProductId: string = event.pathParameters?.id;
  const product: Product = products.find(
    (product: Product) => product.id === requestedProductId
  );

  if (product) {
    return formatJSONResponse(200, { product });
  } else {
    return formatJSONResponse(400, { error: "Not found" });
  }
};

export const main = middyfy(getProductById);
