import { errors } from 'celebrate';
import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import connectDb from './config/dbConnection';
import errorHandler from './middleware/errorHandler';
import { requestLogger, errorLogger } from './middleware/logger';
import routes from './routes/index';

dotenv.config();
connectDb();
const port = process.env.PORT || 3000;
const staticPath = path.join(__dirname, 'public');
const app = express();

app.use(cors());
app.use(requestLogger);
app.use(express.json());
app.use(express.static(staticPath));
app.use(routes);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

// eslint-disable-next-line no-console
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
  console.log(`Static files served from: ${staticPath}`);
});
