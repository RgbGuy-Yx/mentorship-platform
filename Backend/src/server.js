import dotenv from 'dotenv';
import app from './app.js';
import connectDB from './config/db.js';

dotenv.config();

const startServer = async () => {
  try {
    await connectDB();

    const PORT = process.env.PORT || 5050;

    app.listen(PORT, () => {
    });
  } catch (error) {
    process.exit(1);
  }
};

process.on('uncaughtException', (err) => {
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  process.exit(1);
});

startServer();
