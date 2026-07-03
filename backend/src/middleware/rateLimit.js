const buckets = new Map();

const createMemoryRateLimiter = ({ windowMs = 15 * 60 * 1000, max = 20, message = 'Demasiados intentos. Intenta nuevamente más tarde.' } = {}) => {
  return (req, res, next) => {
    const key = `${req.ip || req.socket?.remoteAddress || 'unknown'}:${req.path}`;
    const now = Date.now();
    const bucket = buckets.get(key) || { count: 0, resetAt: now + windowMs };

    if (bucket.resetAt <= now) {
      bucket.count = 0;
      bucket.resetAt = now + windowMs;
    }

    bucket.count += 1;
    buckets.set(key, bucket);

    if (bucket.count > max) {
      const retryAfter = Math.ceil((bucket.resetAt - now) / 1000);
      res.set('Retry-After', String(retryAfter));
      return res.status(429).json({ error: message });
    }

    next();
  };
};

module.exports = { createMemoryRateLimiter };
