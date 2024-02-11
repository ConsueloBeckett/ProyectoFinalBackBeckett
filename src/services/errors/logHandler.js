import logger from "../errors/logger.js";

const loggerMiddleware = function (req, res, next) {
  req.logger = logger;
  next();
};

export default loggerMiddleware;