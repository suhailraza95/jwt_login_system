exports.badRequest = (msg) => {
  const err = new Error(msg);
  err.statusCode = 400;
  throw err;
};
 
exports.notFound = (msg) => {
  const err = new Error(msg);
  err.statusCode = 404;
  throw err;
};
 
exports.unauthorized = (msg) => {
  const err = new Error(msg);
  err.statusCode = 401;
  throw err;
};