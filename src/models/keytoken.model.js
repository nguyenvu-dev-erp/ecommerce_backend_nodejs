'use strict';

const {model, Schema} = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Key'; // Set the name of the document
const COLLECTION_NAME = 'Keys'; // Set the name of the collection

// Declare the Schema of the Mongo model
var keyTokenSchema = new Schema({
    user:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:'Shop',
    },
    privateKey:{
        type:String,
        required:true,
    },
    publicKey:{
        type:String,
        require:true,
    },
    refreshTokenUsed:{
        type:Array,
        default:[],
    },
    refreshToken:{
        type:String,
        required:true,
    }
}, {
    timestamps:true,
    collection: COLLECTION_NAME,
});

//Export the model
module.exports = model(DOCUMENT_NAME, keyTokenSchema);