const ajvInstance = require("../../config/ajv-Instance");

const forgotPasswordREQSchema = {

  type: "object",

  properties: {

    email: {
      type: "string",
      format: "email"
    }

  },

  required: [
    "email"
  ],

  additionalProperties: false

};

module.exports = ajvInstance.compile(
  forgotPasswordREQSchema
);