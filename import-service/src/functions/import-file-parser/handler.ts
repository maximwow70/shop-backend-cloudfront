import { default as csv } from "csv-parser";
import {
  S3Client,
  GetObjectCommand,
  CopyObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { Readable } from "stream";
import { formatJSONResponse } from "src/core/api-gateway";
import { STATUS_CODE } from "src/core/models/status-code.enum";

const importFileParser = async (event) => {
  const BUCKET_NAME: string = "fujifilm-products-service";
  const client = new S3Client({ region: "us-east-1" });

  try {
    for (const record of event.Records) {
      const objectName = record.s3.object.key;

      const getObjectResult = await client.send(
        new GetObjectCommand({
          Bucket: BUCKET_NAME,
          Key: objectName,
        })
      );

      let results = [];

      await (getObjectResult.Body as Readable)
        .pipe(csv({}))
        .on("data", (data) => results.push(data))
        .on("end", () => {
          console.log(results);
        });

      await client.send(
        new CopyObjectCommand({
          Bucket: BUCKET_NAME,
          CopySource: `${BUCKET_NAME}/${objectName}`,
          Key: record.s3.object.key.replace("uploaded", "parsed"),
        })
      );
      await client.send(
        new DeleteObjectCommand({
          Bucket: BUCKET_NAME,
          Key: objectName,
        })
      );
    }
    return formatJSONResponse(STATUS_CODE.OK, {
      message: "successfully data parsed and moved to parsed folder",
    });
  } catch (err) {
    console.error(err);
    return formatJSONResponse(STATUS_CODE.SERVER_ERROR, {
      message: err.message,
    });
  }
};

export const main = importFileParser;
