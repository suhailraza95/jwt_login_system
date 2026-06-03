const ajvInstance = require("../../config/ajv-Instance");

const refreshTokenREQSchema = {

  type: "object",

  properties: {

    refreshToken: {
      type: "string",
      minLength: 1
    }

  },

  required: [
    "refreshToken"
  ],

  additionalProperties: false

};

module.exports = ajvInstance.compile(
  refreshTokenREQSchema
);