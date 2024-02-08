import chai from 'chai'
import { describe } from 'mocha'
import supertest from 'supertest'


const expect = chai.expect
const requester = supertest('http://localhost:8080')

describe("Testing PF Products", ()=>{
    describe("test de PF Products", ()=>{
   //TEST1
        it("EP POST /api/products", async()=>{
            const productsMock={
                name: "Berenjena",
                description: "asada o salteada",
                price: 2000,
                category: "vegetable",
                stock: 4,
                thumbnail:"img"
            }
            const {
                statusCode,
                ok,
                _body
            }=await requester.post("/api/products").send(productsMock)
            console.log(statusCode)
            console.log(ok)
            console.log(_body)
        })
        


    })

    // TEST2
    it("EP GET /api/products/:id", async () => {
        const productId = "65c19a813a2d17d8df2f515d";
        const {
            statusCode,
            ok,
            _body
        } = await requester.get(`/api/products/${productId}`);
        console.log(statusCode);
        console.log(ok);
        console.log(_body);
    });

    // TEST3
    it("EP PUT /api/products/:id", async () => {
        const productId = "65c19a813a2d17d8df2f515d"; 
        const updatedProduct = {
            name: "Updated Berenjena",
            description: "Updated description",
            price: 2500,
            category: "updated_category",
            stock: 5,
            thumbnail: "updated_img"
        };
        const {
            statusCode,
            ok,
            _body
        } = await requester.put(`/api/products/${productId}`).send(updatedProduct);
        console.log(statusCode);
        console.log(ok);
        console.log(_body);
    });


})