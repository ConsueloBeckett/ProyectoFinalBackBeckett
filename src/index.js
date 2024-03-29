import express from "express";
import { engine } from "express-handlebars"
import * as path from "path"
import __dirname from "./utils.js"
import session from "express-session"
import sessionConfig from "./config/session.config.js"
import connectMongo from "./config/mongo.config.js"
import dotenv from 'dotenv'
import methodOverride from 'method-override';
import passport from "passport"
import specs from "./config/swagger.config.js";
import initializePassport from "./config/passport.config.js"
import swaggerUiExpress  from 'swagger-ui-express';
import logHandler from './services/errors/logHandler.js'
dotenv.config()

import ViewsRouter from "./router/views.routes.js"
import ProductsRouter from "./router/products.routes.js"
import CartsRouter from "./router/carts.routes.js"
import UserRouter from "./router/user.routes.js"

const app = express()
const PORT = process.env.PORT || 8080

connectMongo()

//session
app.use(session(sessionConfig))

//passport
initializePassport()
app.use(passport.initialize())
app.use(passport.session())

//middlewarers
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride(`_method`));
app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

//logger
app.use(logHandler)

//habdlebars
app.engine("handlebars", engine())
app.set("view engine", "handlebars")
app.set("views", path.resolve(__dirname + "/views"))

//statis routes
app.use("/", express.static(__dirname + "/public"))

//rutas vistas
app.use("/", ViewsRouter)
app.use("/api/products/css", express.static(__dirname + "/public/css"))
app.use("/api/products/img", express.static(__dirname + "/public/img"))

//crud
app.use("/api/users", UserRouter)
app.use("/api/carts", CartsRouter)
app.use("/api/products", ProductsRouter)



app.get('/loggerTry', function (req, res) {
    req.logger.error("Error message")
     req.logger.warn("Warning message")
     req.logger.info("Information message")
     req.logger.http("http message")
     req.logger.verbose("Verbose message")
     req.logger.debug("Debug message")
     req.logger.silly("Silly message") 
     res.send('Hello World');
});

app.listen(PORT, () => console.log(`Listening to the port ${PORT}`))
