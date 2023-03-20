import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { dynamoDBClient } from "./database";
import { v4 as uuid } from "uuid";
import { Product } from "src/core/models/product";

class ProductService {
  private productsTableName: string = "ProductsTable";
  private stocksTableName: string = "StocksTable";

  constructor(private docClient: DocumentClient) {}

  async getProducts(): Promise<Product[]> {
    const products = await this.docClient
      .scan({
        TableName: this.productsTableName,
      })
      .promise();
    const stocks = await this.docClient
      .scan({
        TableName: this.stocksTableName,
      })
      .promise();

    console.log("Products and stocks succesfully executed from database");
    return products.Items.map((product) => {
      const count: number = stocks.Items.find(
        (stock) => stock.product_id === product.id
      )?.count;
      return {
        ...product,
        count,
      };
    }) as Product[];
  }

  async getProduct(id: string): Promise<Product> {
    const paramsProduct = {
      TableName: this.productsTableName,
      ExpressionAttributeValues: {
        ":id": id,
      },
      KeyConditionExpression: "id = :id",
    };

    const paramsStock = {
      TableName: this.stocksTableName,
      ExpressionAttributeValues: {
        ":product_id": id,
      },
      KeyConditionExpression: "product_id = :product_id",
    };
    const products = await this.docClient.query(paramsProduct).promise();
    const stocks = await this.docClient.query(paramsStock).promise();

    console.log("Products and stocks succesfully executed from database");
    return { ...products.Items[0], count: stocks.Items[0].count } as Product;
  }

  async createProduct(product: Product): Promise<Product> {
    const id: string = uuid();

    const params = {
      TransactItems: [
        {
          Put: {
            TableName: this.productsTableName,
            Item: {
              id: id,
              title: product.title,
              description: product.description,
              price: product.price,
            },
            ConditionExpression: "attribute_not_exists(id)",
          },
        },
        {
          Put: {
            TableName: this.stocksTableName,
            Item: {
              count: product.count,
              product_id: id,
            },
            ConditionExpression: "attribute_not_exists(product_id)",
          },
        },
      ],
    };

    await this.docClient.transactWrite(params).promise();
    const createdProduct: Product = {
      ...product,
      id: id,
    };
    console.log("Product was created in database: ", createdProduct);
    return createdProduct;
  }
}

const productService = new ProductService(dynamoDBClient());
export default productService;
