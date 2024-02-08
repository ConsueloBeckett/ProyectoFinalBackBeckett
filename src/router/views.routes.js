import express from "express";
import authorizedRole from "../config/auth.config.js";

const viewsRouter = express.Router()


viewsRouter.get("/inicio", async (req, res) => {
    res.render("inicio", {
        title: "App de compras",
    })
})
viewsRouter.get("/register", (req, res) => {
    res.render("register", {
        title: "Registro de Usuario"
    })
})

viewsRouter.get("/login", (req, res) => {
    res.render("login", {
        title: "Login de Usuario"
    })
})

viewsRouter.get("/addProducts", authorizedRole("admin"), (req, res) => {
    res.render("addProducts", {
        title: "Agregar Productos"
    })
})

export default viewsRouter