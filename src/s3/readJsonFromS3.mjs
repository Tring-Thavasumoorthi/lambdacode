import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { streamToString } from "../utils/utils.mjs";

const s3 = new S3Client();

export const readJson = async (bucketName, key) => {
  try {
    // Get the JSON file
    const getCommand = new GetObjectCommand({ Bucket: bucketName, Key: key });
    const response = await s3.send(getCommand);
    const jsonString = await streamToString(response?.Body);

    let data = JSON.parse(jsonString);

    console.log("JSON file updated successfully.");
    return { status: true, message: data };
  } catch (error) {
    console.error("Error read s3:", error);
    return {
      status: false,
      message: `Error while reading from S3: ${error?.message}`,
    };
  }
};
