import  LoggerService  from '../services/loggerService.js'

class LoggerController {
  constructor(env) {
    this.loggerService = new LoggerService(env);
  }

  loggerTest(req, res) {
    this.loggerService.logDebug('Debug message from loggerTest');
    this.loggerService.logInfo('Info message from loggerTest');
    this.loggerService.logWarning('Warning message from loggerTest');
    this.loggerService.logError('Error message from loggerTest');
    this.loggerService.logFatal('Fatal message from loggerTest');

    res.status(200).json({ message: 'Logger test completed' });
  }
}
export default LoggerController;
