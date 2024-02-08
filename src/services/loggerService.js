import  getLogger from '../logger.js'

class LoggerService {
  constructor(env) {
    this.logger = getLogger(env);
  }

  logDebug(message) {
    this.logger.debug(message);
  }

  logError(message) {
    this.logger.error(message);
  }

  logInfo(message) {
    this.logger.info(message);
  }

  logWarning(message) {
    this.logger.warning(message);
  }

  logFatal(message) {
    this.logger.fatal(message);
  }
}

export default  LoggerService;
