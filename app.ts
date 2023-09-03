function countLabel(labels: string[], rekognitionPayload: LabelData) {
  return rekognitionPayload.Labels.filter((label: { Name: string }) => labels.includes(label.Name)).reduce((acc: number, label: any) => acc + label.Instances.length || 1, 0);
}

const main = async (events: EventPayload[]) => {
  const [event] = events;
  const data = JSON.parse(Buffer.from(event.data, 'base64').toString('utf-8'));
  const dynamoPayload = data?.dynamodb?.NewImage?.payload?.S;

  if (!dynamoPayload) throw new Error('No payload found');

  const { deviceCode, rekognitionPayload, timestamp, objectKey } = JSON.parse(dynamoPayload) as { deviceCode: string; rekognitionPayload: LabelData; timestamp: number, objectKey: string };

  const digestedObject = {
    deviceCode,
    objectKey,
    timestamp,
    detectedLabels: rekognitionPayload.Labels.map(label => ({ name: label.Name, count: countLabel([label.Name], rekognitionPayload) })),
  }

  return digestedObject;
};

type EventPayload = {
  eventSource: string;
  eventVersion: '1.0';
  eventID: string;
  eventName: string;
  invokeIdentityArn: string;
  awsRegion: string;
  eventSourceARN: string;
  kinesisSchemaVersion: string;
  partitionKey: string;
  sequenceNumber: string;
  data: string;
  approximateArrivalTimestamp: number;
}

type Label = {
  Name: string;
  Confidence: number;
  Instances: Instance[];
  Parents: Parent[];
  Aliases: Alias[];
  Categories: Category[];
};

type Instance = {
  BoundingBox: BoundingBox;
  Confidence: number;
};

type BoundingBox = {
  Width: number;
  Height: number;
  Left: number;
  Top: number;
};

type Parent = {
  Name: string;
};

type Alias = {
  Name: string;
};

type Category = {
  Name: string;
};

type LabelData = {
  Labels: Label[];
  LabelModelVersion: string;
};

export { main };