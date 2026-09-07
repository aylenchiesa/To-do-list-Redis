import Redis from 'ioredis';

export class RedisClient {
  private client: Redis;

  constructor(host: string = 'localhost', port: number = 6379) {
    this.client = new Redis({
      host,
      port,
      retryStrategy: (times) => Math.min(times * 50, 2000),
      maxRetriesPerRequest: 3,
    });

    this.client.on('connect', () => {
      console.log('✓ Connected to Redis');
    });

    this.client.on('error', (err) => {
      console.error('✗ Redis error:', err.message);
    });
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (ttl) {
      await this.client.setex(key, ttl, value);
    } else {
      await this.client.set(key, value);
    }
  }

  async get(key: string): Promise<string | null> {
    return await this.client.get(key);
  }

  async delete(key: string): Promise<number> {
    return await this.client.del(key);
  }

  async exists(key: string): Promise<boolean> {
    const result = await this.client.exists(key);
    return result === 1;
  }

  async lpush(key: string, ...values: string[]): Promise<number> {
    return await this.client.lpush(key, ...values);
  }

  async rpop(key: string): Promise<string | null> {
    return await this.client.rpop(key);
  }

  async lpop(key: string): Promise<string | null> {
    return await this.client.lpop(key);
  }

  async lrange(key: string, start: number = 0, stop: number = -1): Promise<string[]> {
    return await this.client.lrange(key, start, stop);
  }

  async hset(key: string, field: string, value: string): Promise<number> {
    return await this.client.hset(key, field, value);
  }

  async hget(key: string, field: string): Promise<string | null> {
    return await this.client.hget(key, field);
  }

  async hgetall(key: string): Promise<Record<string, string>> {
    return await this.client.hgetall(key);
  }

  async hdel(key: string, field: string): Promise<number> {
    return await this.client.hdel(key, field);
  }

  async sadd(key: string, ...members: string[]): Promise<number> {
    return await this.client.sadd(key, ...members);
  }

  async smembers(key: string): Promise<string[]> {
    return await this.client.smembers(key);
  }

  async srem(key: string, member: string): Promise<number> {
    return await this.client.srem(key, member);
  }

  async ttl(key: string): Promise<number> {
    return await this.client.ttl(key);
  }

  async expire(key: string, seconds: number): Promise<number> {
    return await this.client.expire(key, seconds);
  }

  async flushall(): Promise<string> {
    return await this.client.flushall();
  }

  async close(): Promise<void> {
    await this.client.quit();
  }
}
