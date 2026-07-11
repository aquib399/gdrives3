import { BaseCacheTier, TierEntry, TierWriteOptions } from "./base.js";
import { redis } from "@/clients/redis.js";

export interface L2TierConfig {
  logger?: Pick<Console, "warn" | "error">;
}

export class L2Tier extends BaseCacheTier {
  public readonly tierName = "L2";

  private readonly logger: Pick<Console, "warn" | "error">;

  constructor(config: L2TierConfig = {}) {
    super();
    this.logger = config.logger ?? console;
  }

  public async get<T>(key: string): Promise<TierEntry<T> | undefined> {
    try {
      const raw = await redis.get(key);
      if (raw == null) return undefined;

      const value = this.deserialize<T>(raw, (err) =>
        this.logger.warn(
          `[${this.tierName}] corrupted payload for key "${key}". Deleting entry.`,
          err
        )
      );

      if (value === undefined) {
        void redis.del(key).catch(() => undefined);
        return undefined;
      }

      return { value, sizeBytes: Buffer.byteLength(raw, "utf8") };
    } catch (err) {
      this.logger.warn(`[${this.tierName}] read failed for key "${key}":`, err);
      return undefined;
    }
  }

  public async set<T>(
    key: string,
    entry: TierEntry<T>,
    options: TierWriteOptions
  ): Promise<void> {
    const serialized = this.serialize(entry.value, (err) =>
      this.logger.warn(`[${this.tierName}] serialization failed:`, err)
    );
    if (serialized === undefined) return;

    try {
      if (options.ttlSeconds > 0) {
        await redis.set(key, serialized, "EX", options.ttlSeconds);
      } else {
        await redis.set(key, serialized);
      }
    } catch (err) {
      this.logger.warn(
        `[${this.tierName}] write failed for key "${key}":`,
        err
      );
    }
  }

  public async delete(key: string): Promise<void> {
    try {
      await redis.del(key);
    } catch (err) {
      this.logger.warn(
        `[${this.tierName}] delete failed for key "${key}":`,
        err
      );
    }
  }

  public async deleteByPattern(pattern: string): Promise<void> {
    try {
      let cursor = 0;
      do {
        const [nextCursor, keys] = await redis.scan(
          cursor,
          "MATCH",
          pattern,
          "COUNT",
          100
        );
        cursor = Number(nextCursor);
        if (keys.length > 0) {
          await redis.del(...keys);
        }
      } while (cursor !== 0);
    } catch (err) {
      this.logger.warn(
        `[${this.tierName}] pattern delete failed for pattern "${pattern}":`,
        err
      );
    }
  }

  public async clear(): Promise<void> {
    // Deliberately a no-op: a shared Redis instance backing L2 should not
    // be flushed wholesale by an application-level clearMemory() call.
    // If you introduce a tier where "clear everything" is safe (e.g. a
    // dedicated disk cache), implement it for real there.
    this.logger.warn(
      `[${this.tierName}] clear() is a no-op by design for a shared Redis-backed tier.`
    );
  }
}
