function countLabel(labels: string[], rekognitionPayload: any) {
  return rekognitionPayload.Labels.filter((label: { Name: string }) => labels.includes(label.Name)).reduce((acc, label) => acc + label.Instances.length, 0);
}

const main = async (events: EventPayload[]) => {
  const [event] = events;
  const data = JSON.parse(Buffer.from(event.data, 'base64').toString('utf-8'));
  const dynamoPayload = data?.dynamodb?.NewImage?.payload?.S;

  if (!dynamoPayload) throw new Error('No payload found');

  const { deviceCode, rekognitionPayload } = JSON.parse(dynamoPayload);

  const digestedObject = {
    deviceCode,
    passengerCount: countLabel(['Person'], rekognitionPayload),
  }

  return {
    statusCode: 200,
    body: digestedObject,
  };
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