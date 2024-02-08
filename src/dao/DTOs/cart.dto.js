// cart.dto.js
export default class CartDTO {
    constructor(cart) {
        this.name = cart && cart.name ? cart.name : "";
        this.description = cart && cart.description ? cart.description : "";
        this.products = cart && cart.products ? cart.products : [];
    }
}
