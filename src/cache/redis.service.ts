import Redis from "ioredis";

export class RedisService {
  private redis: Redis;

  constructor() {
    const url = process.env.REDIS_URL;
    if (!url) throw new Error("REDIS_URL is not defined");

    this.redis = new Redis(url);
  }

  async addEvent(stream: string, data: Record<string, any>) {
    return this.redis.xadd(stream, "*", ...Object.entries(data).flat());
  }

  async readEvents(stream: string, lastId = "0") {
    return this.redis.xread("BLOCK", 0, "STREAMS", stream, lastId);
  }
}
