import express from "express";
import { engine } from "express-handlebars"
import * as path from "path"
import __dirname from "./utils.js"
import session from "express-session"
import sessionConfig from "./config/session.config.js"
import connectMongo from "./config/mongo.config.js"
import dotenv from 'dotenv'
import passport from "passport"
import initializePassport from "./config/passport.config.js"
import viewsRouter from "./router/views.routes.js"
import productsRouter from "./router/products.routes.js"
import sessionsRouter from "./router/sessions.routes.js"
import cartsRouter from "./router/carts.routes.js"
import userRouter from "./router/user.routes.js"
import swaggerJSDoc from 'swagger-jsdoc';
import SwaggerUiExpress  from 'swagger-ui-express';
import router from './router/router.js';
dotenv.config()

const app = express()
const PORT = 8080

connectMongo()

app.use(session(sessionConfig))
initializePassport()

app.use(passport.initialize())
app.use(passport.session())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const swaggerOptions = {
    definition:{
        openapi: "3.0.1",
        info:{
            title: "Documentation of API finalProyect",
            description: "Integracion DOC_API"
        },
    },
    apis:["src/docs/products.yaml",
    "src/docs/carts.yaml",
]
}

const specs = swaggerJSDoc(swaggerOptions)
app.use("/apidocs", SwaggerUiExpress.serve, SwaggerUiExpress.setup(specs))

app.engine("handlebars", engine())
app.set("view engine", "handlebars")
app.set("views", path.resolve(__dirname + "/views"))

app.use("/", express.static(__dirname + "/public"))
app.use('/', router);
app.use("/", viewsRouter)

app.use("/api/users", userRouter)
app.use("/api/carts", cartsRouter)
app.use("/api/products", productsRouter)
app.use("/api/sessions", sessionsRouter)

app.listen(PORT, () => console.log(`Listening to the port ${PORT}`))
