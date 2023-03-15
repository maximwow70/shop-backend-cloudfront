import { default as csv } from "csv-parser";
import {
  GetObjectCommandInput,
  S3Client,
  GetObjectCommand,
  CopyObjectCommand,
  CopyObjectCommandInput,
  DeleteObjectCommand,
  DeleteObjectCommandInput,
} from "@aws-sdk/client-s3";
import { Readable } from "stream";
import { middyfy } from "src/core/lambda";
import { STATUS_CODE } from "../../../../core/models/status-code.enum";
import { formatJSONResponse } from "src/core/api-gateway";

const importFileParser = async (event) => {
  try {
    for (const record of event.Records) {
      const objectName = record.s3.object.key;
      const command: GetObjectCommandInput = {
        Bucket: process.env.BUCKET_NAME,
        Key: objectName,
      };
      const copyCommand: CopyObjectCommandInput = {
        Bucket: process.env.BUCKET_NAME,
        CopySource: process.env.BUCKET_NAME + "/" + objectName,
        Key: record.s3.object.key.replace("uploaded", "parsed"),
      };
      const deleteCommand: DeleteObjectCommandInput = {
        Bucket: process.env.BUCKET_NAME,
        Key: objectName,
      };
      const client = new S3Client({ region: "us-east-1" });
      let results = [];
      const getObjectResult = await client.send(new GetObjectCommand(command));
      await (getObjectResult.Body as Readable)
        .pipe(csv({}))
        .on("data", (data) => results.push(data))
        .on("end", () => {
          console.log(results);
        });
      await client.send(new CopyObjectCommand(copyCommand));
      await client.send(new DeleteObjectCommand(deleteCommand));
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

export const main = middyfy(importFileParser);
