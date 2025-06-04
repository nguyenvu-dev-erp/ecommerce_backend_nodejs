'use strict';

const {model, Schema} = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Apikey'; // Set the name of the document
const COLLECTION_NAME = 'Apikeys'; // Set the name of the collection

// Declare the Schema of the Mongo model
var apiKeySchema = new Schema({
    key:{
        type:String,
        required:true,
        unique:true,
    },
    status:{
        type:Boolean,
        default:true,
    },
    permissions:{
        type:[String],
        required:true,
        enmum:['0000', '1111', '2222']
    },
}, {
    timestamps:true,
    collection: COLLECTION_NAME,
});

//Export the model
module.exports = model(DOCUMENT_NAME, apiKeySchema);