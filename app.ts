import { S3Event } from "aws-lambda";
import { PrismaClient } from '@prisma/client';
import { SNS } from "@aws-sdk/client-sns";
const prisma = new PrismaClient()

type DetectLabelsParams = {
  bucketName: string;
  objectName: string;
};
/* 
async function detectLabels({ bucketName, objectName }: DetectLabelsParams) {
  const desiredLabels = ["Person", "Knife", "Gun", "Weapon"];

  return new Rekognition().detectLabels({
    Image: {
      S3Object: {
        Bucket: bucketName,
        Name: objectName,
      },
    },
    MinConfidence: parseInt(process.env.REKOGNITION_MIN_CONFIDENCE || "80"),
    Settings: {
      GeneralLabels: {
        LabelInclusionFilters: desiredLabels,
      },
    },
  });
}

async function insertDynamoDBItem(data: Record<string, any>) {
  const dynamoDB = new DynamoDB({ region: "us-east-1" });

  return dynamoDB.putItem({
    TableName: "lvb-analysis-payload",
    Item: {
      id: { S: nanoid() },
      payload: { S: JSON.stringify(data) },
      insertedAt: { S: new Date().toISOString() }
    },
  });
}

function countLabel(labels: string[], rekognitionPayload: any) {
  return rekognitionPayload.Labels.filter((label: { Name: string }) => labels.includes(label.Name)).reduce((acc, label) => acc + label.Instances.length, 0);
} */

const main = async (event: S3Event) => {
  return new SNS({
    region: "us-east-1",
  })
    .publish({
      TopicArn: "arn:aws:sns:us-east-1:033809494047:teste",
      Message: JSON.stringify(event),
    });
};

export { main };