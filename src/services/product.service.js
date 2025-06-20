'use strict';

const { BadRequestError } = require('../core/error.response');
const {product, clothing, electronic, furniture} = require('../models/product.model');
const { 
    findAllDraftsForShop, 
    publishProductByShop,
    findAllPublishForShop,
    searchProductByUser,
    findAllProducts,
    findProduct,
    updateProductById,
 } = require('../models/reponsetories/product.repo');
const { removeUndefindedObject, updateNestedObject } = require('../utils');

//define Factory class to create product

class ProductFactory {
    static productRegistry = {} //key-class

    static registerProductType(type, classRef) {
        ProductFactory.productRegistry[type] = classRef
    }

    static async createProduct(type, payload) {
        const productClass = ProductFactory.productRegistry[type]
        if (!productClass) throw new BadRequestError(`Invalid product type: ${type}`)
        return new productClass(payload).createProduct()
    }

    static async updateProduct(type, productId, payload) {
        const productClass = ProductFactory.productRegistry[type]
        if (!productClass) throw new BadRequestError(`Invalid product type: ${type}`)
        return new productClass(payload).updateProduct(productId)
    }
    // PUT //
    static async publishProductByShop({product_shop, product_id}) {
        return await publishProductByShop({product_shop, product_id})
    }

    static async unPublishProductByShop({product_shop, product_id}) {
        return await publishProductByShop({product_shop, product_id})
    }
    // END PUT //


    // Query //
    static async findAllDraftsForShop({product_shop, limit=50, skip=0}) {
        const query = {product_shop, isDraft: true}
        return await findAllDraftsForShop({query, limit, skip})
    }

    static async findAllPublishForShop({product_shop, limit=50, skip=0}) {
        const query = {product_shop, isPublic: true}
        return await findAllPublishForShop({query, limit, skip})
    }

    static async searchProducts (keySearch) {
        return await searchProductByUser({keySearch})
    }

    static async findAllProducts ({limit=50, sort='ctime', page=1, filter={isPublic: true}}) {
        return await findAllProducts({limit, sort, page, filter, 
            select: ['product_name', 'product_price', 'product_thumb']
        })
    }

    static async findProduct ({product_id}) {
        return await findProduct({product_id, unSelect: ['__v']})
    }

    
}

//define base product class

class Product {
    constructor({
        product_name,
        product_thumb,
        product_description,
        product_price,
        product_quantity,
        product_type,
        product_shop,
        product_attributes,
    }) {
        this.product_name = product_name;
        this.product_thumb = product_thumb;
        this.product_description = product_description;
        this.product_price = product_price;
        this.product_quantity = product_quantity;
        this.product_type = product_type;
        this.product_shop = product_shop;
        this.product_attributes = product_attributes;
    }

    //create new product
    async createProduct(product_id) {
        return await product.create({
                ...this,
                _id: product_id,
            })
    }

    async updateProduct(productId, payload) {
        return await updateProductById({productId, payload, model: product})
    }
}

//define sub class for different product type = clothing
class Clothing extends Product {

    async createProduct() {
        const newClothing = await clothing.create({
            ...this.product_attributes,
            product_shop: this.product_shop,
        })
        if (!newClothing) throw new BadRequestError('Create new clothing error')
        
        const newProduct = await super.createProduct(newClothing._id)
        if (!newProduct) throw new BadRequestError('Create new product error')

        return newProduct
    }

    async updateProduct (productId) {
        const objectParams = removeUndefindedObject(this)
 
        if(objectParams.product_attributes) {
             await updateProductById({productId,
                payload: updateNestedObject(objectParams.product_attributes), 
                model: clothing})
        }
 
        const updateProduct = await super.updateProduct(productId, objectParams)
        return updateProduct
    }
}

//define sub class for different product type = electronic
class Electronic extends Product {
    async createProduct() {
        const newElectronic = await electronic.create({
            ...this.product_attributes,
            product_shop: this.product_shop,
        })
        if (!newElectronic) throw new BadRequestError('Create new electronic error')

        const newProduct = await super.createProduct(newElectronic._id)
        if (!newProduct) throw new BadRequestError('Create new product error')

        return newProduct
    }
}

//define sub class for different product type = furniture
class Furniture extends Product {
    async createProduct() {
        const newFurniture = await furniture.create({
            ...this.product_attributes,
            product_shop: this.product_shop,
        })
        if (!newFurniture) throw new BadRequestError('Create new furniture error')

        const newProduct = await super.createProduct(newFurniture._id)
        if (!newProduct) throw new BadRequestError('Create new product error')

        return newProduct
    }

    async updateProduct (productId) {
        console.log(this)
        const objectParams = removeUndefindedObject(this)
        console.log(objectParams)
        if(objectParams.product_attributes) {
             await updateProductById({productId,
                payload: updateNestedObject(objectParams.product_attributes), 
                model: furniture})
        }
 
        const updateProduct = await super.updateProduct(productId, objectParams)
        return updateProduct
    }
}

//register product type
ProductFactory.registerProductType('Electronics', Electronic)
ProductFactory.registerProductType('Clothing', Clothing)
ProductFactory.registerProductType('Furniture', Furniture)

module.exports = ProductFactory;