const express = require("express");
const path = require("path");
const swaggerUi = require("swagger-ui-express");
const redoc = require("redoc-express");
const YAML = require("yamljs");

const router = express.Router();

const swaggerDocument = YAML.load(
  path.join(__dirname, "../docs/openapi.yaml")
);

router.use(
  "/swaggerui",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument)
);

router.get(
  "/redoc",
  redoc({
    title: "JWT Login System API",
    specUrl: "/docs/openapi.yaml",
  })
);

router.get("/openapi.yaml", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../docs/openapi.yaml")
  );
});

module.exports = router;