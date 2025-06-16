'use strict'

const { model, Types } = require("mongoose")
const { product } = require("../product.model")


const findAllDraftsForShop = async({query, limit, skip}) => {
    return await queryProduct({query, limit, skip})
}

const findAllPublishForShop = async({query, limit, skip}) => {
    return await queryProduct({query, limit, skip})
}

const searchProductByUser = async({keySearch}) => {
    console.log('keySearch', keySearch)
    const regexSearch = new RegExp(keySearch)
    const results = await product.find({
        isPublic: true,
        $text: {$search: regexSearch}
        }, {score: {$meta: 'textScore'}})
        .sort({score: {$meta: 'textScore'}})
        .lean()
    return results
}

const publishProductByShop = async({product_shop, product_id}) => {
    const foundShop = await product.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id),
    })
    if (!product_shop) return null

    foundShop.isDraft = false
    foundShop.isPublic = true

    const {modifiedCount} = await foundShop.updateOne(foundShop)

    return modifiedCount
}

const unPublishProductByShop = async({product_shop, product_id}) => {
    const foundShop = await product.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id),
    })
    if (!product_shop) return null

    foundShop.isDraft = true
    foundShop.isPublic = false

    const {modifiedCount} = await foundShop.updateOne(foundShop)

    return modifiedCount
}



const queryProduct = async ({query, limit, skip}) => {
    return await product.find(query).
        populate('product_shop', 'name email -_id')
        .sort({updateAt: -1})
        .skip(skip)
        .limit(limit)
        .lean()
        .exec()
}

module.exports = {
    findAllDraftsForShop,
    findAllPublishForShop,
    publishProductByShop,
    unPublishProductByShop,
    searchProductByUser,
}