require('dotenv').config();

const express = require('express');
const connectDB = require('./config/db');
const morgan = require("morgan");
 

const userRoutes = require('./routes/userRoutes');



const errorMiddleware = require('./middleware/errorMiddleware');
const apiKeyMiddleware = require('./middleware/apiKeyMiddleware');

const app = express();
app.use(morgan("tiny"));
// CONNECT DATABASE
connectDB();

// REQUIRED FOR req.body
app.use(express.json());


// ROUTES
app.use('/api',apiKeyMiddleware, userRoutes);


app.use(errorMiddleware);


// SERVER
app.listen(process.env.PORT, () => {
  console.log('Server running 🚀');
});