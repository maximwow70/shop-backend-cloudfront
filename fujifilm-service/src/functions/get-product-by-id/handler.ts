import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { productsMock } from "src/mocks/products.mock";
import { Product } from "src/models/product";

const getProductById: ValidatedEventAPIGatewayProxyEvent<any> = async (
  event: any
) => {
  const requestedProductId: string = event.pathParameters?.id;
  const product: Product = productsMock.find(
    (product: Product) => product.id === requestedProductId
  );
  if (product) {
    return formatJSONResponse(200, { product });
  } else {
    return formatJSONResponse(400, { error: "Not found" });
  }
};

export const main = middyfy(getProductById);
