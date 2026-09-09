import { Redis } from '@upstash/redis';

function hasRedisEnv() {
    return !!(
        (process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL) &&
        (process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN)
    );
}

let redisClient = null;
function getRedis() {
    if (!redisClient) redisClient = Redis.fromEnv();
    return redisClient;
}

// In-memory fallback so `next dev` and local testing work without a Redis integration
// configured yet. Production always has real Upstash/Vercel KV env vars, so this branch
// never runs there.
globalThis.__prayerMemoryStore = globalThis.__prayerMemoryStore || new Map();
const memory = globalThis.__prayerMemoryStore;

export async function kvGet(key) {
    if (hasRedisEnv()) return await getRedis().get(key);
    return memory.has(key) ? memory.get(key) : null;
}

export async function kvSet(key, value, options) {
    if (hasRedisEnv()) return await getRedis().set(key, value, options);
    memory.set(key, value);
    return 'OK';
}

export async function kvDel(key) {
    if (hasRedisEnv()) return await getRedis().del(key);
    memory.delete(key);
}
