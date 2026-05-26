const ajvInstance = require("../../config/ajv-Instance");

const loginREQSchema = {

  type: "object",

  properties: {

    email: {
      type: "string",
      format: "email"
    },

    password: {
      type: "string",
      minLength: 6
    }

  },

  required: [
    "email",
    "password"
  ],

  additionalProperties: false
};

module.exports = ajvInstance.compile(loginREQSchema);