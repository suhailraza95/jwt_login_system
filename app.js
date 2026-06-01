require('dotenv').config();


const express = require('express');
const connectDB = require('./config/db');
const morgan = require("morgan");

const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument =
  YAML.load("./docs/openapi.yaml");

const redoc = require("redoc-express");
 

const authRoutes = require('./routes/authRoutes');
const otpRoutes = require('./routes/otpRoutes');
const passwordRoutes = require('./routes/passwordRoutes');



const errorMiddleware = require('./middleware/errorMiddleware');
const apiKeyMiddleware = require('./middleware/apiKeyMiddleware');

const app = express();
app.use(morgan("tiny"));
// CONNECT DATABASE
connectDB();

// REQUIRED FOR req.body
app.use(express.json());
app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument)
);

app.get(
  "/redoc",
  redoc({
    title: "JWT Login System API",
    specUrl: "/openapi.yaml"
  })
);
app.get("/openapi.yaml", (req, res) => {
  res.sendFile(
    path.join(__dirname, "docs/openapi.yaml")
  );
});



// REQUIRED FOR req.body
app.use(express.json());



// ROUTES
app.use('/api',apiKeyMiddleware, authRoutes);
app.use('/api',apiKeyMiddleware, otpRoutes);
app.use('/api',apiKeyMiddleware, passwordRoutes);


app.use(errorMiddleware);


// SERVER
app.listen(process.env.PORT, () => {
  console.log('Server running 🚀');
});