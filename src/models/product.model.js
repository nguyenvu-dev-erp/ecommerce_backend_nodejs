'use strict';

const { max } = require('lodash');
const {model, Schema} = require('mongoose'); // Erase if already required
const { default: slugify } = require('slugify');

const DOCUMENT_NAME = 'Product'; // Set the name of the document
const COLLECTION_NAME = 'Products'; // Set the name of the collection


const productSchema = new Schema({
    product_name: {type: String, required: true},
    product_thumb: {type: String, required: true},
    product_description: String,
    product_slug: String,
    product_price: {type: Number, required: true},
    product_quantity: {type: Number, required: true},
    product_type: {type: String, required: true, enum: ['Electronics', 'Clothing', 'Furniture']},
    product_shop: {type: Schema.Types.ObjectId, ref: 'Shop'},
    product_attributes: {type: Schema.Types.Mixed, required: true},
    product_ratingsAverage: {
        type: Number, 
        default: 4.5, 
        min: [1, 'Rating must be above 1.0'], 
        max: [5, 'Rating must be above 5.0'],
        set: (val) => Math.round(val * 10) / 10,
    },
    product_variations: {type: Array, default: []},
    isDraft: {type: Boolean, default: true, index: true, select: false},
    isPublic: {type: Boolean, default: false, index: true, select: false},
}, {
    collection: COLLECTION_NAME,
    timestamps: true,
});
//Create index for search
productSchema.index({product_name: 'text', product_description: 'text'})

//Document middelware: run before save and create
productSchema.pre('save', function(next) {
    this.product_slug = slugify(this.product_name, {lower: true})
    next()
})

//define the product type = clothing

const clothingSchema = new Schema({
    brand: {type: String, required: true},
    size: String,
    material: String,
    product_shop: {type: Schema.Types.ObjectId, ref: 'Shop'},
}, {
    collection: 'Clothes',
    timestamps: true,
});

//define the product type = electronic

const electronicSchema = new Schema({
    manufacturer: {type: String, required: true},
    model: String,
    color: String,
    product_shop: {type: Schema.Types.ObjectId, ref: 'Shop'},
}, {
    collection: 'Electronics',
    timestamps: true,
});

//define the product type = furniture

const furnitureSchema = new Schema({
    brand: {type: String, required: true},
    size: String,
    material: String,
    product_shop: {type: Schema.Types.ObjectId, ref: 'Shop'},
}, {
    collection: 'Furniture',
    timestamps: true,
});

module.exports = {
    product: model(DOCUMENT_NAME, productSchema),
    clothing: model('Clothing', clothingSchema),
    electronic: model('Electronic', electronicSchema),
    furniture: model('Furniture', furnitureSchema),
};