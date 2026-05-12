import 'reflect-metadata';
import * as dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { AppDataSource } from './data-source';

import authRoutes from './routes/auth';
import oktatokRoutes from './routes/oktatok';
import hallgatokRoutes from './routes/hallgatok';
import tantargyakRoutes from './routes/tantargyak';
import kurzusokRoutes from './routes/kurzusok';
import beiratkozasokRoutes from './routes/beiratkozasok';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/oktatok', oktatokRoutes);
app.use('/api/hallgatok', hallgatokRoutes);
app.use('/api/tantargyak', tantargyakRoutes);
app.use('/api/kurzusok', kurzusokRoutes);
app.use('/api/beiratkozasok', beiratkozasokRoutes);

AppDataSource.initialize()
  .then(() => {
    console.log('Adatbázis kapcsolat sikeres.');
    app.listen(PORT, () => {
      console.log(`Szerver fut: http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Adatbázis kapcsolat sikertelen:', err);
  });
