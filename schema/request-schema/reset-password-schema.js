const ajvInstance = require("../../config/ajv-Instance");

const resetPasswordREQSchema = {

  type: "object",

  properties: {

    email: {
      type: "string",
      format: "email"
    },

    otp: {
      type: "string",
      minLength: 6,
      maxLength: 6
    },

    newPassword: {
      type: "string",
      minLength: 8
    }

  },

  required: [
    "email",
    "otp",
    "newPassword"
  ],

  additionalProperties: false

};

module.exports = ajvInstance.compile(
  resetPasswordREQSchema
);