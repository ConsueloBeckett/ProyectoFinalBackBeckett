import express from "express";
import authorizedRole from "../config/auth.config.js";
import { createFakeProducts } from "../config/faker.config.js"

const ViewsRouter = express.Router()


ViewsRouter.get("/inicio", async (req, res) => {
    const cartId = req.session.cartId
    const user = req.session.user || null
    res.render("inicio", {
        title: "Shopping App",
        cartId: cartId,
        user: user
    })
})

ViewsRouter.get("/register", (req, res) => {
    const cartId = req.session.cartId || null
    const user = req.session.user || null
    res.render("register", {
        title: "Register User",
        cartId: cartId,
        user: user
    })
})

ViewsRouter.get("/login", (req, res) => {
    const cartId = req.session.cartId
    const user = req.session.user || null
    res.render("login", {
        title: "Login of user",
        cartId: cartId,
        user: user
    })
})

ViewsRouter.get("/reset", (req, res) => {
    const cartId = req.session.cartId
    const user = req.session.user || null
    res.render("reset", {
        title: "Reset Password",
        cartId: cartId,
        user: user
    })
})

ViewsRouter.get("/addProducts", authorizedRole(["admin", "premium"]), (req, res) => {
    const cartId = req.session.cartId
    const user = req.session.user || null

    res.render("addProducts", {
        title: "Add Products",
        cartId: cartId,
        user: user
    })
})

ViewsRouter.get("/mockingProducts", async (req, res) => {
    let products = await createFakeProducts()
    const cartId = req.session.cartId
    const user = req.session.user || null
    res.render("mockingProducts", {
        title: "Add products",
        products: products,
        cartId: cartId,
        user: user
    })
})

ViewsRouter.get("/confirmedProducts", (req, res) => {
    const cartId = req.session.cartId
    const user = req.session.user || null
    res.render("confirmedProducts", {
        title: "Products confirmed",
        products: products,
        cartId: cartId,
        user: user
    })
})

ViewsRouter.get("/documents", (req, res) => {
    const cartId = req.session.cartId
    const user = req.session.user || null

    res.render("upload", {
        title: "Upload Documents",
        cartId: cartId,
        user: user
    })
})

export default ViewsRouter