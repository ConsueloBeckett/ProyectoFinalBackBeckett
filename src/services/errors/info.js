export const generateProductErrorInfo = (product) => {
    return `One or more properties are incomplete or invalid.
    List of required properties:
    *description : needs to be a String, received ${product.description}
    *image : needs to be a String, received ${product.image}
    *price : needs to be a String, received ${product.price}
    *stock : needs to be a String, received ${product.stock}
    *category : needs to be a String, received ${product.category}
    *availability: needs to be a String, received ${product.availability}`
}

export const deleteProductErrorInfo = (product) => {
    return `Error deleting Product.
    *The product that could not be deleted has the id ${id}`
}
export const updateProductErrorInfo = (id, product) => {
    return `Error updating product.
    The product that could not be updated has the id ${id}
    The information entered was the following:
    *description : needs to be a String, received ${product.description}
    *image : needs to be a String, received ${product.image}
    *price : needs to be a String, received ${product.price}
    *stock : needs to be a String, received ${product.stock}
    *category : needs to be a String, received ${product.category}
    *availability: needs to be a String, received ${product.availability}`
}