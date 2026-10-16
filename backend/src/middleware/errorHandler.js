/** 404 handler for unmatched routes. */
export function notFound(req, res) {
  res.status(404).json({ ok: false, error: `Route not found: ${req.method} ${req.originalUrl}` });
}

/**
 * Central error handler. Any controller can call next(err) or throw,
 * and this keeps responses consistent.
 */
export function errorHandler(err, _req, res, _next) {
  const status = Number.isInteger(err?.status) ? err.status : 500;
  const message = err?.expose ? err.message : 'Something went wrong on our end.';

  if (status >= 500) {
    console.error('[opticore-api] unhandled error:', err);
  }

  res.status(status).json({ ok: false, error: message });
}
