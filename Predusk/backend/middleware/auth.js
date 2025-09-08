function authenticate(req, res, next) {
  const apiKey = req.header('x-api-key');
  if (apiKey && apiKey === process.env.API_KEY) {
    return next(); // Key is valid, proceed to the route handler
  }
  res.status(401).json({ error: 'Unauthorized: Missing or invalid API key.' });
}

module.exports = { authenticate };