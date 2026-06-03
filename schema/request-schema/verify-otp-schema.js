const ajvInstance = require("../../config/ajv-Instance");

const verifyOtpREQSchema = {

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
    }

  },

  required: [
    "email",
    "otp"
  ],

  additionalProperties: false
};

module.exports = ajvInstance.compile(verifyOtpREQSchema);