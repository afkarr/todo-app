import express, { Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { todoRouter } from './routes/todo.routes';
import { errorHandler } from './middleware/error.middleware';

dotenv.config();

const app: Express = express();
const PORT: number = parseInt(process.env.PORT || '5000', 10);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/todos', todoRouter);

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, (): void => {
  console.log(`Server running on port ${PORT}`);
});