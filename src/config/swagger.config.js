import swaggerJSDoc from "swagger-jsdoc";
import __dirname from "../utils.js";
import path from "path";

const swaggerOptions = {
    definition: {
        openapi: "1.0",
        info: {
            title: "Starting API REST",
            description: "Backend Coderhouse Beckett Proyect",
            version: "1.0.0"
        }
    },
    apis: [`${path.join(__dirname, "/docs/**/*.yaml")}`],
}

const specs = swaggerJSDoc(swaggerOptions);

export default specs;