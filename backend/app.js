// Import dependencies
const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectToDB = require('./db/db');
const userRoutes = require('./routes/user.routes');
const captainRoutes = require('./routes/captain.routes');

// Initialize app and database connection
const app = express();
connectToDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Test route
app.get('/', (req, res) => {
    res.send('Hello World');
});

// Register routes
app.use('/users', userRoutes);
app.use('/captains', captainRoutes);

// Export app
module.exports = app;