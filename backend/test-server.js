const express = require('express');
const app = express();

// Simple test route
app.get('/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

const PORT = 4001;
app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
}); 