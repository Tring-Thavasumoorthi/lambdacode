import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client();

export const updateJson = async (bucketName, key, data, newData) => {
  try {
    data.push(...newData);
    // Upload the updated JSON
    const putCommand = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: JSON.stringify(data, null, 2),
      ContentType: "application/json",
    });

    await s3.send(putCommand);

    return { status: true, message: "Successfully Updated" };
  } catch (error) {
    console.error("Error: while upload", error);
    return {
      status: false,
      message: `Error while uploading to S3: ${error?.message}`,
    };
  }
};
