'use strict';

const { SuccessResponse } = require('../core/success.response');
const ProductService = require('../services/product.service');

class ProductController {
    static async createProduct(req, res, next) {
        new SuccessResponse({
            message: 'Create new product success',
            metadata: await ProductService.createProduct(req.body.product_type, {
                ...req.body,
                product_shop: req.user.userId,
            }),
        }).send(res)
    }
}

module.exports = ProductController;