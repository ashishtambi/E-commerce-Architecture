require('dotenv').config();
const connectDB = require('./config/db');
const logger = require('./config/logger');
const app = require('./app');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
};

startServer();
