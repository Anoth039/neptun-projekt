import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Oktato } from './entity/Oktato';
import { Hallgato } from './entity/Hallgato';
import { Tantargy } from './entity/Tantargy';
import { Kurzus } from './entity/Kurzus';
import { Beiratkozas } from './entity/Beiratkozas';
import { Felhasznalo } from './entity/Felhasznalo';
import * as dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'neptun_db',
  synchronize: true,
  logging: false,
  entities: [Oktato, Hallgato, Tantargy, Kurzus, Beiratkozas, Felhasznalo],
});
