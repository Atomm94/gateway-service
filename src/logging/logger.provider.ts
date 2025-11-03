import { Provider } from '@nestjs/common';
import { Writable } from 'stream';
import { OpenSearchService } from './opensearch.service';
import { CloudWatchStream, createCloudLogger } from './cloudwatch.logger';

export const LoggerProvider: Provider = {
  provide: 'CUSTOM_LOGGER',
  inject: [OpenSearchService],
  useFactory: (os: OpenSearchService) => {
    // CloudWatch stream
    const cloudStream = new CloudWatchStream();

    // OpenSearch writable stream
    const osStream = new Writable({
      objectMode: true,
      write: async (chunk, _encoding, callback) => {
        try {
          const msg = typeof chunk === 'string' ? chunk : chunk.toString();
          const log = JSON.parse(msg);
          await os.indexLog('saas-logs', log);
        } catch (err) {
          console.error('OpenSearch stream error:', err);
        }
        callback();
      },
    });

    // Create Pino logger with multiple streams
    return createCloudLogger([cloudStream, osStream]);
  },
};
