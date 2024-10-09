// import express from "express"
import dotenv from 'dotenv';
import express from "express";
import user from './routes/user.js';
import admin from './routes/Admin.js'
import  dbconnect  from './DB/db.js';
const app = express();
dotenv.config();
// Middleware for parsing JSON
app.use(express.json());

// Connect to MongoDB
dbconnect(app);

app.use('/api',user)
app.use('/api/admin',admin)

