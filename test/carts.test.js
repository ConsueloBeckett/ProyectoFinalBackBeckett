import chai from 'chai';
import { describe } from 'mocha';
import supertest from 'supertest';


const expect = chai.expect;
const requester = supertest('http://localhost:8080')

describe("Testing PF Carts", () => {
    // TEST1: 
    it("EP POST /api/carts", async () => {
        const cartMock = {
            userId: "user123",
            products: [
                { productId: "product1", quantity: 2 },
                { productId: "product2", quantity: 1 }
               
            ],
            cartId: "123456"

        };

        const { statusCode, ok, body } = await requester.post("/api/carts").send(cartMock);

        expect(statusCode).to.equal(200); 
        expect(ok).to.be.true;
        expect(body).to.have.property('cartId');
        expect(body).to.have.property('userId').equal(cartMock.userId);
        expect(body).to.have.property('products').deep.equal(cartMock.products);
    });

    // TEST2: 
    it("EP GET /api/carts/:cartId", async () => {
        const cartId = "cart123";

        const { statusCode, ok, body } = await requester.get(`/api/carts/${cartId}`);

        expect(statusCode).to.equal(200); 
        expect(body).to.have.property('cartId').equal(cartId);
    });

    // TEST3: 
    it("EP POST /api/carts/:cartId/add-product", async () => {
        const cartId = "cart456";
        const productToAdd = { productId: "newProduct", quantity: 3 };

        const { statusCode, ok, body } = await requester.post(`/api/carts/${cartId}/add-product`).send(productToAdd);

        expect(statusCode).to.equal(200); 
        expect(ok).to.be.true;
        expect(body).to.have.property('cartId').equal(cartId);
        expect(body).to.have.property('products').deep.include(productToAdd);
    });
});
