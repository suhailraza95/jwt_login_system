class ResponseHandler {
 
    static sendSuccess(res, statusCode, data) {
      res.status(statusCode).json({
        status: "success",
        data: data
      });
    }
  
    static sendFailure(res, statusCode, data) {
      res.status(statusCode).json({
        status: "failure",
        data: data
      });
    }
 
}
 
 
module.exports = ResponseHandler;