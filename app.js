require('dotenv').config();


const path = require('path');
const express = require('express');
const connectDB = require('./config/db');
const morgan = require("morgan");

const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument =
  YAML.load(path.join(__dirname, "docs/openapi.yaml"));

const redoc = require("redoc-express");
 

const authRoutes = require('./routes/authRoutes');
const otpRoutes = require('./routes/otpRoutes');
const passwordRoutes = require('./routes/passwordRoutes');
const systemRoutes = require('./routes/system-routes');
const docsRoutes = require("./routes/docsRoutes");


const errorMiddleware = require('./middleware/errorMiddleware');
const apiKeyMiddleware = require('./middleware/apiKeyMiddleware');

const app = express();
app.use(morgan("tiny"));
// CONNECT DATABASE
connectDB();

// REQUIRED FOR req.body
app.use(express.json());

app.use('/api', systemRoutes);
app.use("/docs", docsRoutes);


// ROUTES

app.use('/api',apiKeyMiddleware, authRoutes);
app.use('/api',apiKeyMiddleware, otpRoutes);
app.use('/api',apiKeyMiddleware, passwordRoutes);


app.use(errorMiddleware);


// SERVER
app.listen(process.env.PORT, () => {
  console.log('Server running 🚀');
});