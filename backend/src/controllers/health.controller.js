function getHealth(_req, res) {
  res.json({ success: true, message: 'OK', uptime: process.uptime() });
}

module.exports = { getHealth }; 