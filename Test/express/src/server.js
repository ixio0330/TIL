const express = require('express');
const PORT = 5000;
const HOST = 'localhost';
const app = express();
app.use(express.json());

app.get('/', (res, req) => {
  req.send('Hello TDD!');
});

const productsRoutes = require('./router');
app.use('/api/products', productsRoutes);

app.listen(PORT, HOST, () => {
  console.log(`http://${HOST}:${PORT}`);
});

app.use('*', (error, req, res, next) => {
  res.status(error.status || 500).json({ message: error.message });
});

module.exports = app;