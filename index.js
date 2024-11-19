// import express from "express"
import dotenv from 'dotenv';
import express from "express";
import user from './routes/user.js';
import Booking from './routes/bookingRoute.js'
import admin from './routes/Admin.js'
import  dbconnect  from './DB/db.js'; 
import car from './routes/cars.js'
import cookieParser from 'cookie-parser';
import path from 'path'
import cors from 'cors';
const app = express();
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true,
  }));
dbconnect(app);
app.use('/uploads', express.static(path.join(__dirname, '../../RentRush/public/uploads')));
app.use('/api', user)
app.use('/api/admin', admin)
app.use('/api/car', car);
app.use('/api/bookcar', Booking);

