import errorTypes from "../errors/enum.js";
import errorCauses from "../errors/info.js";

export default class CustomError {
    static createError({ statusCode = 500, causeKey, message }) {
        const errorMessage = errorTypes[statusCode] || "Unknown Error"
        const error = new Error(`${errorMessage}: ${message}`);
        error.name = "CustomError";
        error.statusCode = statusCode;
        error.cause = errorCauses[causeKey] || "Unknown Cause";
        throw error;
    }
}
