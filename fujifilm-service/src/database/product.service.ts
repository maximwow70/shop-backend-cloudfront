import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { Product } from "src/models/product";
import { dynamoDBClient } from "./database";

class ProductService {
  private productsTableName: string = "ProductsTable";
  private stocksTableName: string = "StocksTable";

  constructor(private docClient: DocumentClient) {}

  async getAllProducts(): Promise<Product[]> {
    try {
      const products = await this.docClient
        .scan({
          TableName: this.productsTableName,
        })
        .promise();
      console.log("products: ", products);

      const stocks = await this.docClient
        .scan({
          TableName: this.stocksTableName,
        })
        .promise();
      console.log("stocks: ", stocks);

      return products.Items.map((product) => {
        const count: number = stocks.Items.find(
          (stock) => stock.product_id === product.id
        )?.count;
        return {
          ...product,
          count,
        };
      }) as Product[];
    } catch (err) {
      console.log("ROLLBACK", err);
      throw new Error(err);
    }
  }
}

const productService = new ProductService(dynamoDBClient());
export default productService;
