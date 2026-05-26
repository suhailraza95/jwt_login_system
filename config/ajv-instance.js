const Ajv = require('ajv');
const addFormats = require('ajv-formats');
 
const ajvInstance = new Ajv({
  allErrors: true,     // better for debugging
  removeAdditional: true,
  strict: false        // prevents format warnings
});
 
addFormats(ajvInstance); // ✅ enables "date", "date-time", etc.
 
module.exports = ajvInstance;