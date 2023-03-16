import { Product } from "../models/product";

export const productValidator = (product: Product) => {
  if (!product.title?.trim()) {
    return {
      error: "Title is not valid",
    };
  }

  if (!product.description?.trim()) {
    return {
      error: "Description is not valid",
    };
  }

  if (isNaN(product.price)) {
    return {
      error: "Price is not valid",
    };
  }

  if (isNaN(product.count)) {
    return {
      error: "Count is not valid",
    };
  }

  return {};
};
