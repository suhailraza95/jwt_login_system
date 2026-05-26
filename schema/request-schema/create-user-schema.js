const ajvInstance = require("../../config/ajv-Instance");

const registerREQSchema = {
  type: "object",

  properties: {

    username: {
      type: "string",
      minLength: 3
    },

    email: {
      type: "string",
      format: "email"
    },

    password: {
      type: "string",
      minLength: 6
    },

    privacyPolicyConsent: {
      type: "boolean"
    },

    termsOfServiceConsent: {
      type: "boolean"
    },

    marketingConsent: {
      type: "boolean"
    },

    aiProcessingConsent: {
      type: "boolean"
    }

  },

  required: [
    "username",
    "email",
    "password",
    "privacyPolicyConsent",
    "termsOfServiceConsent",
    "marketingConsent",
    "aiProcessingConsent"
  ],

  additionalProperties: false
};

module.exports = ajvInstance.compile(registerREQSchema);