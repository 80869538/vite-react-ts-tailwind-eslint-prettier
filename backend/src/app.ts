import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import config from 'config';
import connectDB from './utils/connectDB';


console.log('NODE_CONFIG_ENV: ' + config.util.getEnv('NODE_CONFIG_ENV'));

const app = express();

const port = config.get<number>('port');
app.listen(port, () => {
  console.log(`Server started on port: ${port}`);
  connectDB();
});