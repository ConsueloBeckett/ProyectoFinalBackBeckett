import  express from 'express'
import LoggerController from '../controllers/logger.controller.js'

const router = express.Router();
const loggerController = new LoggerController(process.env.NODE_ENV || 'development');

router.get('/loggerTest', (req, res) => {
  loggerController.loggerTest(req, res);
});

export default router;
