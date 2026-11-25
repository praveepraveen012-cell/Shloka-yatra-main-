const ipRequestStore = new Map();

// Periodic cleanup of stale IP buckets every 5 minutes (unref so tests/processes can exit cleanly)
const cleanupTimer = setInterval(() => {
  const now = Date.now();
  for (const [key, data] of ipRequestStore.entries()) {
    if (now - data.resetTime > 60000) {
      ipRequestStore.delete(key);
    }
  }
}, 5 * 60 * 1000);
if (cleanupTimer.unref) {
  cleanupTimer.unref();
}

/**
 * In-memory rate limiting middleware
 * @param {Object} options
 * @param {number} options.windowMs - Time window in milliseconds (default 60s)
 * @param {number} options.max - Max requests per windowMs (default 60)
 * @param {string} options.message - Error message when rate exceeded
 */
export function rateLimiter({ windowMs = 60000, max = 60, message = 'Too many requests, please try again later.' } = {}) {
  return (req, res, next) => {
    // Skip rate limiting during automated test suites
    if (process.env.NODE_ENV === 'test' || process.env.npm_lifecycle_event?.includes('test')) {
      return next();
    }

    const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown-ip';
    const key = `${ip}:${req.baseUrl || req.path}`;
    const now = Date.now();

    const record = ipRequestStore.get(key) || { count: 0, resetTime: now + windowMs };

    if (now > record.resetTime) {
      record.count = 1;
      record.resetTime = now + windowMs;
    } else {
      record.count += 1;
    }

    ipRequestStore.set(key, record);

    res.setHeader('X-RateLimit-Limit', max);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, max - record.count));
    res.setHeader('X-RateLimit-Reset', Math.ceil(record.resetTime / 1000));

    if (record.count > max) {
      return res.status(429).json({
        error: message,
        retryAfterSeconds: Math.ceil((record.resetTime - now) / 1000),
      });
    }

    next();
  };
}
