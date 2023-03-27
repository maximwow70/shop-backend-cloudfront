import { SQSEvent, SQSRecord } from "aws-lambda";
import * as AWS from "aws-sdk";
import * as process from "process";
import productService from "../../database/product.service";
import { Product } from "src/core/models/product";

type Response = { batchItemFailures: { itemIdentifier: string }[] };
export const catalogBatchProcess = async (
  event: SQSEvent
): Promise<Response> => {
  const sns: AWS.SNS = new AWS.SNS({ region: "us-east-1" });
  console.log(`Event Records: ${JSON.stringify(event.Records)}`);

  const response: Response = { batchItemFailures: [] };

  const createdProducts$: Promise<void>[] = event.Records.map(
    async (record) => {
      try {
        const { title, description, price, count } = JSON.parse(record.body);

        const product: Product = await productService.createProduct({
          title,
          description,
          price,
          count,
        } as Product);

        console.log(`Product created ${product.title}}`);

        const params: AWS.SNS.PublishInput = {
          Message: JSON.stringify(product),
          TopicArn: process.env.CREATE_PRODUCT_TOPIC_ARN,
          MessageAttributes: {
            price: {
              DataType: "Number",
              StringValue: product.price.toString(),
            },
          },
        };
        await sns.publish(params).promise();
        console.log(`SNS message sent ${JSON.stringify(params)}`);
      } catch (e) {
        console.log(`Failed to create a product.`);
        response.batchItemFailures.push({ itemIdentifier: record.messageId });
      }
    }
  );

  await Promise.all(createdProducts$);

  return response;
};

export const main = catalogBatchProcess;
