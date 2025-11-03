import { Injectable } from '@nestjs/common';
import { Client } from '@opensearch-project/opensearch';

@Injectable()
export class OpenSearchService {
  private client = new Client({
    node: process.env.OPENSEARCH_URL ?? 'http://localhost:9200',
  });

  async indexLog(index: string, log: Record<string, any>) {
    try {
      await this.client.index({
        index,
        body: { ...log, '@timestamp': new Date().toISOString() },
      });
    } catch (err) {
      console.error('OpenSearch index error:', err);
    }
  }
}
