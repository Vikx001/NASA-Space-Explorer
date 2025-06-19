export default function handler(_req, res) {
  res.status(200).json({
    status: 'OK',
    message: 'NASA Space Explorer API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
}
