// cloudwatch.logger.ts
import { CloudWatchLogs } from 'aws-sdk';
import { Writable } from 'stream';
import pino from 'pino';

const cloudwatch = new CloudWatchLogs({
  region: process.env.AWS_REGION ?? 'us-east-1',
});
const logGroupName = process.env.CW_LOG_GROUP ?? 'saas-logs';
const logStreamName = `${process.env.SERVICE_NAME ?? 'saas-service'}-${Date.now()}`;

let sequenceToken: string | undefined;

// Create log stream
cloudwatch
  .createLogStream({ logGroupName, logStreamName })
  .promise()
  .catch(console.error);

// Custom writable stream for Pino
export class CloudWatchStream extends Writable {
  _write(chunk: any, _encoding: string, callback: Function) {
    const message = chunk.toString();
    cloudwatch
      .putLogEvents({
        logGroupName,
        logStreamName,
        logEvents: [{ message, timestamp: Date.now() }],
        sequenceToken,
      })
      .promise()
      .then((data) => {
        sequenceToken = data.nextSequenceToken;
      })
      .catch((err) => console.error('CloudWatch error:', err));
    callback();
  }
}

// Factory function to create Pino logger
export const createCloudLogger = (streams: Writable[] = []) =>
  pino(
    {
      level: process.env.LOG_LEVEL ?? 'info',
      base: { service: process.env.SERVICE_NAME ?? 'saas-logs-service' },
      timestamp: pino.stdTimeFunctions.isoTime,
    },
    pino.multistream([
      { stream: process.stdout }, // Console
      ...streams.map((s) => ({ stream: s })), // Custom streams
    ])
  );
