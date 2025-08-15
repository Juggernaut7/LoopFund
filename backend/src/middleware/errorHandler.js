function errorHandler(err, _req, res, _next) {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  const details = err.details || undefined;

  if (process.env.NODE_ENV !== 'production') {
    console.error('Error:', err);
  }

  res.status(status).json({ success: false, message, details });
}

module.exports = { errorHandler }; 