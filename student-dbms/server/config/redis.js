const Redis = require("ioredis");

let redisClient;

try {
  redisClient = new Redis(process.env.REDIS_URL || "redis://127.0.0.1:6379", {
    maxRetriesPerRequest: 3,
    retryStrategy(times) {
      if (times > 3) {
        console.warn("⚠️  Redis: Max retries reached. Running without cache.");
        return null; // stop retrying
      }
      return Math.min(times * 200, 2000);
    },
    lazyConnect: false,
  });

  redisClient.on("connect", () => console.log("✅ Redis Connected"));
  redisClient.on("error", (err) => console.error("❌ Redis Error:", err.message));
} catch (error) {
  console.error("❌ Redis Initialization Error:", error.message);
  // Provide a dummy client so the app doesn't crash without Redis
  redisClient = null;
}

module.exports = redisClient;
