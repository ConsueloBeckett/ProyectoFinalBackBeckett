import express from "express";
import authorizedRole from "../config/auth.config.js";
import { createFakeProducts } from "../config/faker.config.js"

const viewsRouter = express.Router()


viewsRouter.get("/inicio", async (req, res) => {
    res.render("inicio", {
        title: "Shopping app",
    })
})
viewsRouter.get("/register", (req, res) => {
    res.render("register", {
        title: "Register User"
    })
})

viewsRouter.get("/login", (req, res) => {
    res.render("login", {
        title: "Login User"
    })
})

viewsRouter.get("/addProducts", authorizedRole(["admin", "premium"]), (req, res) => {
    res.render("addProducts", {
        title: "AddProducts"
    })
})

viewsRouter.get("/mockingProducts", async (req, res) => {
    let products =  createFakeProducts()
    res.render("mockingProducts", {
        title: "Add products",
        products: products
    })
})

viewsRouter.get("/confirmedProducts", (req, res) => {
    res.render("confirmedProducts", {
        title: "Productos Confirmados",
        products: products
    })
})

viewsRouter.get("/documents", (req, res) => {
    res.render("upload", {
        title: "Upload Documents",
    })
})

export default viewsRouter