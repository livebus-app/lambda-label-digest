function countLabel(labels: string[], rekognitionPayload: any) {
  return rekognitionPayload.Labels.filter((label: { Name: string }) => labels.includes(label.Name)).reduce((acc, label) => acc + label.Instances.length, 0);
}

const main = async (events: EventPayload[]) => {
  console.log("chegou um evento aqui!", events);
  const [event] = events;
  const data = JSON.parse(Buffer.from(event.data, 'base64').toString('utf-8'));
  const dynamoPayload = data?.dynamodb?.NewImage?.payload?.S;

  if (!dynamoPayload) throw new Error('No payload found');

  const { deviceCode, rekognitionPayload, timestamp } = JSON.parse(dynamoPayload);

  const digestedObject = {
    deviceCode,
    passengerCount: countLabel(['Person'], rekognitionPayload),
    timestamp: timestamp,
  }

  return digestedObject;
};

interface EventPayload {
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

export { main };