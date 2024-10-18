class CustomAPIError extends Error {
    constructor(
        statusCode=501,
        message= "Something went wrong",
        loc="Error from Server side",
    ){
        super(message)
        this.statusCode = statusCode
        this.message = message
    }
}
  
const createError = (statusCode,message,loc) => {
return new CustomAPIError(statusCode, message);
}
export { CustomAPIError, createError};