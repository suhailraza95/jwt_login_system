function validateDto(ajvValidate) {
  return (req, res, next) => {
    const valid = ajvValidate(req.body);
 
    if (!valid) {
      const firstError = ajvValidate.errors?.[0];
 
      let message = "Validation error";
 
      if (firstError) {
        if (firstError.keyword === "required") {
          message = `${firstError.params.missingProperty} is required`;
        } else {
          message = firstError.message;
        }
      }
 
      const error = new Error(message);
      error.statusCode = 400;
 
      return next(error);
    }
 
    next();
  };
}
  
  module.exports = validateDto;