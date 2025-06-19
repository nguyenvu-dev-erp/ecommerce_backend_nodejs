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

    static async updateProduct(req, res, next) {
        new SuccessResponse({
            message: 'Update product success',
            metadata: await ProductService.updateProduct(req.body.product_type, req.params.productId, {
                ...req.body,
                product_shop: req.user.userId,
            })
        }).send(res)
    }

    static async publishProductByShop(req, res, next) {
        new SuccessResponse({
            message: 'Publish product by shop success!',
            metadata: await ProductService.publishProductByShop({
                product_id: req.params.id,
                product_shop: req.user.userId,
            }),
        }).send(res)
    }

    static async unPublishProductByShop(req, res, next) {
        new SuccessResponse({
            message: 'UnPublish product by shop success!',
            metadata: await ProductService.unPublishProductByShop({
                product_id: req.params.id,
                product_shop: req.user.userId,
            }),
        }).send(res)
    }

    /**
     * @desc Get all Drafts for shop
     * @param {Number} limit
     * @param {Number} skip
     * @return {JSON}
     **/
    static async getAllDraftsForShop (req, res, next) {
        new SuccessResponse({
            message: 'Get list Drafts success',
            metadata: await ProductService.findAllDraftsForShop({
                product_shop: req.user.userId
            })
        }).send(res)
    }

    /**
     * @desc Get all Drafts for shop
     * @param {Number} limit
     * @param {Number} skip
     * @return {JSON}
     **/
    static async getPublishForShop (req, res, next) {
        new SuccessResponse({
            message: 'Get list Drafts success',
            metadata: await ProductService.findAllPublishForShop({
                product_shop: req.user.userId
            })
        }).send(res)
    }

    static async getListSearchProduct (req, res, next) {
        new SuccessResponse({
            message: 'Get list Products success',
            metadata: await ProductService.searchProducts(req.params.keySearch)
        }).send(res)
    }

    static async findAllProducts (req, res, next) {
        new SuccessResponse({
            message: 'Get all products success',
            metadata: await ProductService.findAllProducts(req.query)
        }).send(res)
    }

    static async findProduct (req, res, next) {
        new SuccessResponse({
            message: 'Get product success',
            metadata: await ProductService.findProduct({
                product_id: req.params.product_id
            })
        }).send(res)
    }
}

module.exports = ProductController;